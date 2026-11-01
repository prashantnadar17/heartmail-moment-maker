import { describe, expect, it } from "vitest";
import { validateDeliverAt } from "@/lib/schedule";

describe("validateDeliverAt", () => {
  it("accepts empty scheduling (deliver now)", () => {
    expect(validateDeliverAt(null)).toEqual({ ok: true, iso: "" });
    expect(validateDeliverAt("")).toEqual({ ok: true, iso: "" });
  });

  it("accepts a future date within one year and returns ISO", () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const result = validateDeliverAt(future);
    expect(result.ok).toBe(true);
    if (result.ok) expect(new Date(result.iso).getTime()).toBeGreaterThan(Date.now());
  });

  it("rejects a past date", () => {
    const past = new Date(Date.now() - 60_000).toISOString();
    expect(validateDeliverAt(past).ok).toBe(false);
  });

  it("rejects dates more than one year ahead", () => {
    const far = new Date(Date.now() + 370 * 24 * 60 * 60 * 1000).toISOString();
    expect(validateDeliverAt(far).ok).toBe(false);
  });

  it("rejects nonsense input", () => {
    expect(validateDeliverAt("not-a-date").ok).toBe(false);
  });
});
