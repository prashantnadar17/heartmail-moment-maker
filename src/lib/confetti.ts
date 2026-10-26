const CONFETTI_COLORS = ["#7965F2", "#FF7D8E", "#EAE5FF", "#FFF9F2"];

/** Fires a celebration burst. Only call from event handlers / effects. */
export async function fireConfetti(): Promise<void> {
  if (typeof window === "undefined") return;
  const confetti = (await import("canvas-confetti")).default;
  const base = { colors: CONFETTI_COLORS, zIndex: 60, disableForReducedMotion: true };
  confetti({ ...base, particleCount: 90, spread: 75, origin: { y: 0.65 } });
  confetti({ ...base, particleCount: 40, spread: 110, startVelocity: 32, origin: { y: 0.7 } });
}
