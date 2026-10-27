import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, RotateCcw } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";
import { ExperienceFrame, type ExperienceProps } from "./experience-frame";

const GRID = 9;

export function PhotoPuzzleExperience({ personalization, mode = "live" }: ExperienceProps) {
  const [revealed, setRevealed] = useState<boolean[]>(() => Array(GRID).fill(false));
  const done = revealed.every(Boolean);
  const photo = personalization.photos[0];

  useEffect(() => {
    if (done) void fireConfetti();
  }, [done]);

  const reveal = (index: number) => {
    if (revealed[index] || done) return;
    setRevealed((prev) => prev.map((r, i) => (i === index ? true : r)));
  };

  const reset = () => setRevealed(Array(GRID).fill(false));

  return (
    <ExperienceFrame className={mode === "demo" ? "h-full" : ""}>
      {done && (
        <button
          type="button"
          onClick={reset}
          className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card"
        >
          <RotateCcw className="size-3.5" />
          Replay
        </button>
      )}

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
        <p className="font-display text-2xl font-semibold text-foreground">
          {done ? `For ${personalization.recipientName}` : "A photo, hidden in nine pieces"}
        </p>
        <p className="-mt-3 text-sm text-muted-foreground">
          {done ? "Every piece, a memory with you" : "Tap each tile to uncover it"}
        </p>

        <div className="grid w-64 grid-cols-3 gap-1.5 rounded-xl bg-white/10 p-1.5">
          {revealed.map((isRevealed, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            return (
              <button
                key={i}
                type="button"
                onClick={() => reveal(i)}
                disabled={isRevealed}
                aria-label={isRevealed ? "Revealed tile" : `Reveal tile ${i + 1}`}
                className="group relative aspect-square overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {photo ? (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${photo})`,
                      backgroundSize: "300% 300%",
                      backgroundPosition: `${col * 50}% ${row * 50}%`,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/50 to-coral/50">
                    <Heart className="size-6 text-primary-foreground/80" />
                  </div>
                )}
                <AnimatePresence>
                  {!isRevealed && (
                    <motion.span
                      key="cover"
                      className="absolute inset-0 flex items-center justify-center rounded-lg border border-border bg-card text-sm font-semibold text-muted-foreground"
                      initial={false}
                      exit={{ rotateY: 90, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      {i + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
                {personalization.message}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                — {personalization.senderName}
              </p>
              {personalization.photos.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {personalization.photos.slice(1, 5).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Memory ${i + 2}`}
                      className="size-14 rounded-lg border border-border object-cover"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ExperienceFrame>
  );
}
