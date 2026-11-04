import { describe, expect, it } from "vitest";
import {
  computePrice,
  generateCardToken,
  hmacSha256Hex,
  timingSafeHexEqual,
  verifyRazorpayPaymentSignature,
} from "@/lib/payments";

describe("computePrice", () => {
  it("subtracts the discount from the base price", () => {
    expect(computePrice(24900, 5000)).toEqual({ original: 24900, discount: 5000, final: 19900 });
  });

  it("never charges more than the base price", () => {
    expect(computePrice(19900, 50000).final).toBe(0);
  });

  it("rounds fractional paise instead of trusting them", () => {
    expect(computePrice(199.6, 0).original).toBe(200);
    expect(computePrice(19900, 49.4).discount).toBe(49);
  });
});

describe("timingSafeHexEqual", () => {
  it("matches identical signatures and rejects altered ones", () => {
    expect(timingSafeHexEqual("aabbcc", "aabbcc")).toBe(true);
    expect(timingSafeHexEqual("aabbcc", "aabbcD")).toBe(false);
    expect(timingSafeHexEqual("aabbcc", "aabb")).toBe(false);
  });
});

describe("razorpay signature verification", () => {
  const secret = "test-secret";
  const message = "order_ABC|pay_XYZ";

  it("accepts a payment signed with the correct secret", async () => {
    const signature = await hmacSha256Hex(secret, message);
    const ok = await verifyRazorpayPaymentSignature({
      razorpayOrderId: "order_ABC",
      paymentId: "pay_XYZ",
      signature,
      secret,
    });
    expect(ok).toBe(true);
  });

  it("rejects a forged signature so a card is never published", async () => {
    const ok = await verifyRazorpayPaymentSignature({
      razorpayOrderId: "order_ABC",
      paymentId: "pay_XYZ",
      signature: await hmacSha256Hex("wrong-secret", message),
      secret,
    });
    expect(ok).toBe(false);
  });
});

describe("generateCardToken", () => {
  it("produces URL-safe, unguessable tokens", () => {
    const token = generateCardToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{30,40}$/);
    expect(token).not.toBe(generateCardToken());
    expect(token).not.toContain("/");
    expect(token).not.toContain("+");
    expect(token).not.toContain("=");
  });
});
