import { describe, expect, it } from "vitest";
import { isLockedForDelivery, validateDeliverAt } from "@/lib/schedule";

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

describe("isLockedForDelivery", () => {
  const now = Date.parse("2026-11-02T12:00:00Z");

  it("never locks a card without a schedule", () => {
    expect(isLockedForDelivery(null, now)).toBe(false);
    expect(isLockedForDelivery("", now)).toBe(false);
    expect(isLockedForDelivery(undefined, now)).toBe(false);
  });

  it("locks a card until its scheduled time arrives", () => {
    const later = "2026-11-03T09:00:00Z";
    expect(isLockedForDelivery(later, now)).toBe(true);
    expect(isLockedForDelivery(later, Date.parse("2026-11-03T09:00:01Z"))).toBe(false);
  });

  it("unlocks exactly at the scheduled time, not a minute later", () => {
    const at = "2026-11-03T09:00:00Z";
    expect(isLockedForDelivery(at, Date.parse(at))).toBe(false);
  });

  it("treats an invalid stored time as unlocked rather than permanently hidden", () => {
    expect(isLockedForDelivery("not-a-date", now)).toBe(false);
  });
});
