import { createFileRoute } from "@tanstack/react-router";
import { hmacSha256Hex, sha256Hex, timingSafeHexEqual } from "@/lib/payments";
import { processRazorpayEvent } from "@/lib/payments.functions";

/**
 * Razorpay webhook (external caller). The raw body's HMAC signature is verified
 * with RAZORPAY_WEBHOOK_SECRET before anything is processed, and events are
 * deduplicated so Razorpay retries can never publish a card twice.
 *
 * Configure the webhook URL (published deployment) as:
 *   https://<published-domain>/api/public/webhooks/razorpay
 * Active events: payment.captured, payment.failed.
 */
export const Route = createFileRoute("/api/public/webhooks/razorpay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["RAZORPAY_WEBHOOK_SECRET"];
        if (!secret) {
          return new Response("Webhook not configured", { status: 503 });
        }

        const raw = await request.text();
        const signature = request.headers.get("x-razorpay-signature") ?? "";
        const expected = await hmacSha256Hex(secret, raw);
        if (!timingSafeHexEqual(expected, signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let parsed: { event?: string; payload?: unknown };
        try {
          parsed = JSON.parse(raw) as { event?: string; payload?: unknown };
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const eventId =
          request.headers.get("x-razorpay-event-id") || (await sha256Hex(`${raw}:${signature}`));

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error: dedupeError } = await supabaseAdmin.from("webhook_events").insert({
          provider: "razorpay",
          event_id: eventId,
          payload: parsed as never,
        });
        if (dedupeError) {
          // Unique violation means we already handled this exact event.
          return Response.json({ ok: true, duplicate: true });
        }

        try {
          await processRazorpayEvent(parsed.event ?? "", parsed.payload ?? {});
        } catch (error) {
          console.error("razorpay webhook processing failed", error);
          return new Response("Processing failed", { status: 500 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});
