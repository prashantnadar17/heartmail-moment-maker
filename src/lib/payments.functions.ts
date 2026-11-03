import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  computePrice,
  sha256Hex,
  verifyRazorpayPaymentSignature,
} from "./payments";

/**
 * Checkout + publication pipeline. Prices are computed server-side from the
 * template row; a card is published (draft → published + cards row) only after
 * an HMAC-verified payment. Without Razorpay credentials the flow runs in
 * clearly-labelled test mode: orders are signed with PAYMENT_SANDBOX_SECRET and
 * pass through the exact same verification path a live payment will.
 *
 * Live-mode secrets (add later, no code changes needed):
 *   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET
 */

const RAZORPAY_API = "https://api.razorpay.com/v1";

export type CheckoutOrder = {
  mode: "test" | "live";
  orderRef: string;
  providerOrderId: string;
  amountPaise: number;
  originalPaise: number;
  discountPaise: number;
  currency: string;
  razorpayKeyId: string | null;
};

export type PaymentOutcome =
  | { ok: true; reference: string; alreadyPaid: boolean }
  | { ok: false; error: string };

function razorpayCredentials(): { keyId: string; keySecret: string } | null {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

function sandboxSecret(): string | null {
  return process.env["PAYMENT_SANDBOX_SECRET"] ?? null;
}

async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function createRazorpayOrder(
  auth: { keyId: string; keySecret: string },
  amountPaise: number,
  orderRef: string,
): Promise<string> {
  const response = await fetch(`${RAZORPAY_API}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${auth.keyId}:${auth.keySecret}`)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt: orderRef,
      notes: { orderRef },
    }),
  });
  if (!response.ok) throw new Error("The payment gateway refused the order. Please try again.");
  const created = (await response.json()) as { id?: string };
  if (!created.id) throw new Error("The payment gateway returned an unexpected response.");
  return created.id;
}

type RazorpayPayment = {
  id: string;
  order_id: string;
  amount: number;
  status: string;
};

async function fetchRazorpayPayment(
  auth: { keyId: string; keySecret: string },
  paymentId: string,
): Promise<RazorpayPayment> {
  const response = await fetch(`${RAZORPAY_API}/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Basic ${btoa(`${auth.keyId}:${auth.keySecret}`)}` },
  });
  if (!response.ok) throw new Error("We couldn't confirm that payment with the gateway.");
  const payment = (await response.json()) as RazorpayPayment;
  if (!payment.id || !payment.order_id) {
    throw new Error("The payment gateway returned an unexpected response.");
  }
  return payment;
}

/**
 * Single publication path shared by the checkout callback, the sandbox flow and
 * the Razorpay webhook. Idempotent: a repeated call for an already-paid order
 * returns success without publishing anything twice.
 */
export async function verifyAndPublish(args: {
  orderRef: string;
  providerOrderId: string;
  paymentId: string;
  signature: string;
  secret: string | null;
  skipSignature?: boolean;
  mode: "test" | "live";
  amountPaise: number;
  currency: string;
}): Promise<PaymentOutcome> {
  const supabaseAdmin = await adminClient();

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select(
      "id, draft_id, status, mode, provider_order_id, final_amount_paise, currency, drafts(session_reference, expires_at)",
    )
    .eq("id", args.orderRef)
    .maybeSingle();
  if (orderError || !order || !order.drafts) {
    return { ok: false, error: "We couldn't find that order." };
  }
  if (order.status === "paid") {
    return { ok: true, reference: order.drafts.session_reference, alreadyPaid: true };
  }
  if (order.status !== "awaiting_payment" && order.status !== "created") {
    return { ok: false, error: "This order can no longer be completed." };
  }
  if (order.mode !== args.mode) {
    return { ok: false, error: "This payment doesn't match the order's payment mode." };
  }
  if (order.provider_order_id !== args.providerOrderId) {
    return { ok: false, error: "This payment doesn't belong to this order." };
  }
  if (order.final_amount_paise !== args.amountPaise) {
    return { ok: false, error: "The paid amount doesn't match the order total." };
  }
  if (args.currency !== order.currency) {
    return { ok: false, error: "The payment currency doesn't match the order." };
  }
  if (!args.skipSignature) {
    if (!args.secret) return { ok: false, error: "Payment verification isn't configured." };
    const valid = await verifyRazorpayPaymentSignature({
      razorpayOrderId: args.providerOrderId,
      paymentId: args.paymentId,
      signature: args.signature,
      secret: args.secret,
    });
    if (!valid) return { ok: false, error: "We couldn't verify that payment. No card was published." };
  }

  // Claim the order first so two concurrent verifications can't both publish.
  const { data: claimed, error: claimError } = await supabaseAdmin
    .from("orders")
    .update({ status: "paid", updated_at: new Date().toISOString() })
    .eq("id", order.id)
    .in("status", ["created", "awaiting_payment"])
    .select("id");
  if (claimError) return { ok: false, error: "Saving your payment failed. Please contact support." };
  if (!claimed || claimed.length === 0) {
    const { data: current } = await supabaseAdmin
      .from("orders")
      .select("status")
      .eq("id", order.id)
      .maybeSingle();
    if (current?.status === "paid") {
      return { ok: true, reference: order.drafts.session_reference, alreadyPaid: true };
    }
    return { ok: false, error: "This order can no longer be completed." };
  }

  // Record the verified payment (upsert keeps webhook + callback idempotent).
  await supabaseAdmin.from("payments").upsert(
    {
      order_id: order.id,
      provider_payment_id: args.paymentId,
      provider_signature: args.signature,
      amount_paise: args.amountPaise,
      currency: args.currency,
      mode: args.mode,
      status: "verified",
      verified_at: new Date().toISOString(),
    },
    { onConflict: "provider_payment_id" },
  );

  await supabaseAdmin
    .from("drafts")
    .update({ status: "published" })
    .eq("id", order.draft_id)
    .eq("status", "draft");

  await supabaseAdmin.from("cards").upsert(
    {
      draft_id: order.draft_id,
      order_id: order.id,
      public_token: order.drafts.session_reference,
      token_hash: await sha256Hex(order.drafts.session_reference),
      mode: args.mode,
      status: "active",
      expires_at: order.drafts.expires_at,
    },
    { onConflict: "public_token" },
  );

  return { ok: true, reference: order.drafts.session_reference, alreadyPaid: false };
}

/** Handles a verified webhook event body after its signature has been checked. */
export async function processRazorpayEvent(eventName: string, payload: unknown): Promise<void> {
  const entity = (
    payload as {
      payment?: { entity?: { id?: string; order_id?: string; amount?: number } };
    }
  )?.payment?.entity;
  if (!entity?.order_id || !entity.id) return;

  const supabaseAdmin = await adminClient();
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id, status, mode, provider_order_id, final_amount_paise, currency")
    .eq("provider_order_id", entity.order_id)
    .maybeSingle();
  if (!order) return;

  if (eventName === "payment.captured") {
    if (order.final_amount_paise !== entity.amount) {
      throw new Error("Webhook amount does not match the order.");
    }
    await verifyAndPublish({
      orderRef: order.id,
      providerOrderId: order.provider_order_id ?? entity.order_id,
      paymentId: entity.id,
      signature: "",
      secret: null,
      skipSignature: true, // the raw-body HMAC was already verified by the route
      mode: order.mode as "test" | "live",
      amountPaise: order.final_amount_paise,
      currency: order.currency,
    });
  } else if (eventName === "payment.failed") {
    await supabaseAdmin
      .from("orders")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("id", order.id)
      .in("status", ["created", "awaiting_payment"]);
  }
}

export const createCheckoutOrder = createServerFn({ method: "POST" })
  .inputValidator((data: { reference: string }) =>
    z.object({ reference: z.string().min(1).max(64) }).parse(data),
  )
  .handler(async ({ data }): Promise<CheckoutOrder> => {
    const supabaseAdmin = await adminClient();

    const { data: draft, error: draftError } = await supabaseAdmin
      .from("drafts")
      .select("id, status, templates(base_price_paise, discount_amount_paise)")
      .eq("session_reference", data.reference)
      .maybeSingle();
    if (draftError) throw new Error(draftError.message);
    if (!draft || draft.status !== "draft" || !draft.templates) {
      throw new Error("This card can no longer be checked out.");
    }

    // Reuse an open order so retries never double-charge.
    const { data: existing } = await supabaseAdmin
      .from("orders")
      .select(
        "id, mode, provider_order_id, status, original_amount_paise, discount_amount_paise, final_amount_paise, currency",
      )
      .eq("draft_id", draft.id)
      .in("status", ["created", "awaiting_payment"])
      .maybeSingle();

    let order = existing;
    if (!order) {
      const price = computePrice(
        draft.templates.base_price_paise,
        draft.templates.discount_amount_paise,
      );
      const credentials = razorpayCredentials();
      const mode: "test" | "live" = credentials ? "live" : "test";
      let providerOrderId = `order_test_${crypto.randomUUID().replace(/-/g, "").slice(0, 14)}`;
      if (credentials && mode === "live") {
        providerOrderId = await createRazorpayOrder(credentials, price.final, data.reference);
      }
      const { data: inserted, error: insertError } = await supabaseAdmin
        .from("orders")
        .insert({
          draft_id: draft.id,
          original_amount_paise: price.original,
          discount_amount_paise: price.discount,
          final_amount_paise: price.final,
          currency: "INR",
          payment_provider: "razorpay",
          provider_order_id: providerOrderId,
          mode,
          status: "awaiting_payment",
        })
        .select(
          "id, mode, provider_order_id, status, original_amount_paise, discount_amount_paise, final_amount_paise, currency",
        )
        .single();
      if (insertError || !inserted) throw new Error(insertError?.message ?? "Order failed");
      order = inserted;
    }

    return {
      mode: order.mode as "test" | "live",
      orderRef: order.id,
      providerOrderId: order.provider_order_id ?? "",
      amountPaise: order.final_amount_paise,
      originalPaise: order.original_amount_paise,
      discountPaise: order.discount_amount_paise,
      currency: order.currency,
      razorpayKeyId: order.mode === "live" ? (razorpayCredentials()?.keyId ?? null) : null,
    };
  });

/** Test-mode payment: signs with the sandbox secret and runs the real verify path. */
export const paySandboxOrder = createServerFn({ method: "POST" })
  .inputValidator((data: { orderRef: string }) =>
    z.object({ orderRef: z.string().min(1).max(64) }).parse(data),
  )
  .handler(async ({ data }): Promise<PaymentOutcome> => {
    const secret = sandboxSecret();
    if (!secret) {
      return { ok: false, error: "Test payments aren't configured. Please try again later." };
    }
    const supabaseAdmin = await adminClient();
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, status, mode, provider_order_id, final_amount_paise, currency")
      .eq("id", data.orderRef)
      .maybeSingle();
    if (!order) return { ok: false, error: "We couldn't find that order." };
    if (order.mode !== "test") {
      return { ok: false, error: "This order is set up for live payments." };
    }
    const paymentId = `pay_test_${crypto.randomUUID().replace(/-/g, "")}`;
    const providerOrderId = order.provider_order_id ?? "";
    return verifyAndPublish({
      orderRef: order.id,
      providerOrderId,
      paymentId,
      signature: await import("./payments").then((m) =>
        m.hmacSha256Hex(secret, `${providerOrderId}|${paymentId}`),
      ),
      secret,
      mode: "test",
      amountPaise: order.final_amount_paise,
      currency: order.currency,
    });
  });

/** Live-mode checkout callback: verifies the signature Razorpay Checkout returns. */
export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator((data: {
    orderRef: string;
    razorpayOrderId: string;
    paymentId: string;
    signature: string;
  }) =>
    z
      .object({
        orderRef: z.string().min(1).max(64),
        razorpayOrderId: z.string().min(1).max(120),
        paymentId: z.string().min(1).max(120),
        signature: z.string().min(1).max(256),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<PaymentOutcome> => {
    const credentials = razorpayCredentials();
    if (!credentials) return { ok: false, error: "Live payments aren't configured yet." };

    const supabaseAdmin = await adminClient();
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, status, mode, provider_order_id, final_amount_paise, currency")
      .eq("id", data.orderRef)
      .maybeSingle();
    if (!order || order.mode !== "live") {
      return { ok: false, error: "This order isn't set up for live payments." };
    }

    // Confirm independently with the gateway: this payment belongs to this
    // order, for this exact amount, and has completed.
    const payment = await fetchRazorpayPayment(credentials, data.paymentId);
    if (payment.order_id !== data.razorpayOrderId || payment.order_id !== order.provider_order_id) {
      return { ok: false, error: "This payment doesn't belong to this order." };
    }
    if (payment.amount !== order.final_amount_paise) {
      return { ok: false, error: "The paid amount doesn't match the order total." };
    }
    if (payment.status === "authorized") {
      const captured = await fetch(
        `${RAZORPAY_API}/payments/${encodeURIComponent(data.paymentId)}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`${credentials.keyId}:${credentials.keySecret}`)}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: payment.amount, currency: order.currency }),
        },
      );
      if (!captured.ok) {
        return { ok: false, error: "The payment is still processing. Please check back shortly." };
      }
    } else if (payment.status !== "captured") {
      return { ok: false, error: "The payment hasn't completed yet. Please try again." };
    }

    return verifyAndPublish({
      orderRef: order.id,
      providerOrderId: order.provider_order_id ?? data.razorpayOrderId,
      paymentId: data.paymentId,
      signature: data.signature,
      secret: credentials.keySecret,
      mode: "live",
      amountPaise: order.final_amount_paise,
      currency: order.currency,
    });
  });
