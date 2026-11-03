// Pure payment helpers shared by server functions, the webhook route and tests.
// Prices are integer paise; signatures use Web Crypto so they run on the edge
// runtime as well as in Node during tests. Never import server-only modules here.

export type PriceBreakdown = { original: number; discount: number; final: number };

/** Server-side price calculation. The final amount is never taken from the browser. */
export function computePrice(basePricePaise: number, discountPaise: number): PriceBreakdown {
  const original = Math.max(0, Math.round(basePricePaise));
  const discount = Math.min(Math.max(0, Math.round(discountPaise)), original);
  return { original, discount, final: original - discount };
}

function toHex(bytes: Uint8Array): string {
  let out = "";
  for (const byte of bytes) out += byte.toString(16).padStart(2, "0");
  return out;
}

export async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return toHex(new Uint8Array(signature));
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return toHex(new Uint8Array(digest));
}

/**
 * Razorpay checkout signature check: HMAC_SHA256(`${order_id}|${payment_id}`, secret).
 * Same algorithm is used in test mode with the sandbox signing secret.
 */
export async function verifyRazorpayPaymentSignature(args: {
  razorpayOrderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}): Promise<boolean> {
  const expected = await hmacSha256Hex(args.secret, `${args.razorpayOrderId}|${args.paymentId}`);
  return timingSafeHexEqual(expected, args.signature);
}

/** Length-independent comparison so signature checks don't leak timing. */
export function timingSafeHexEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** High-entropy, URL-safe token for private card links — not sequential, not a DB id. */
export function generateCardToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
