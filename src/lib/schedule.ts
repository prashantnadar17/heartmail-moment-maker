export type DeliverAtCheck =
  | { ok: true; iso: string }
  | { ok: false; reason: string };

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Validates a scheduled delivery time chosen by the card creator.
 * Accepts a date-time string (e.g. from <input type="datetime-local"> or ISO)
 * and requires it to be in the future, within one year.
 */
export function validateDeliverAt(value: string | null | undefined): DeliverAtCheck {
  if (value == null || value.trim() === "") return { ok: true, iso: "" };
  const when = new Date(value);
  if (Number.isNaN(when.getTime())) {
    return { ok: false, reason: "That date and time doesn't look valid." };
  }
  if (when.getTime() < Date.now()) {
    return { ok: false, reason: "Pick a delivery time in the future." };
  }
  if (when.getTime() > Date.now() + ONE_YEAR_MS) {
    return { ok: false, reason: "Cards can be scheduled at most one year ahead." };
  }
  return { ok: true, iso: when.toISOString() };
}

/**
 * Whether a card should stay hidden from its recipient right now because its
 * scheduled delivery time hasn't arrived yet.
 */
export function isLockedForDelivery(
  deliverAt: string | null | undefined,
  now: number = Date.now(),
): boolean {
  if (!deliverAt) return false;
  const when = new Date(deliverAt);
  if (Number.isNaN(when.getTime())) return false;
  return when.getTime() > now;
}
