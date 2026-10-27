import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";
import { ExperienceFrame, type ExperienceProps } from "./experience-frame";

const CANDLE_COUNT = 5;

const STARS = [
  { top: "10%", left: "8%", size: 3, delay: 0 },
  { top: "18%", left: "26%", size: 2, delay: 0.6 },
  { top: "8%", left: "55%", size: 3, delay: 1.1 },
  { top: "24%", left: "74%", size: 2, delay: 0.3 },
  { top: "14%", left: "88%", size: 3, delay: 0.9 },
  { top: "40%", left: "5%", size: 2, delay: 1.4 },
  { top: "32%", left: "92%", size: 2, delay: 0.5 },
  { top: "50%", left: "14%", size: 2, delay: 1.8 },
];

export function BirthdayExperience({ personalization, mode = "live" }: ExperienceProps) {
  const [lit, setLit] = useState<boolean[]>(() =>
    Array.from({ length: CANDLE_COUNT }, () => true),
  );
  const allOut = lit.every((c) => !c);

  useEffect(() => {
    if (allOut) void fireConfetti();
  }, [allOut]);

  const extinguish = (index: number) => {
    setLit((prev) => prev.map((c, i) => (i === index ? false : c)));
  };

  const reset = () => setLit(Array.from({ length: CANDLE_COUNT }, () => true));

  return (
    <ExperienceFrame className={mode === "demo" ? "h-full" : ""}>
      {STARS.map((star, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-primary-foreground/70"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: star.delay }}
        />
      ))}

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
        <AnimatePresence mode="wait">
          {allOut ? (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                <span className="text-gradient-violet">Happy Birthday</span>
              </p>
              <p className="mt-2 font-display text-4xl font-bold text-foreground sm:text-5xl">
                {personalization.recipientName}!
              </p>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {personalization.message}
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                With love, {personalization.senderName}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="cake"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-muted-foreground">
                Tap the candles to blow them out
              </p>
              <div className="mt-6 flex flex-col items-center">
                <div className="flex items-end gap-4">
                  {lit.map((isLit, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => extinguish(i)}
                      aria-label={isLit ? "Blow out candle" : "Candle is out"}
                      className="relative flex flex-col items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="relative block h-8 w-4">
                        <AnimatePresence>
                          {isLit && (
                            <motion.span
                              key="flame"
                              className="absolute -top-1 left-1/2 block -translate-x-1/2"
                              exit={{ scale: 0, opacity: 0, y: -6 }}
                              transition={{ duration: 0.25 }}
                            >
                              <motion.span
                                className="block h-5 w-3 rounded-full bg-gradient-to-t from-coral via-amber-300 to-amber-200"
                                animate={{ scaleY: [1, 0.82, 1.08, 0.9, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                              />
                            </motion.span>
                          )}
                          {!isLit && (
                            <motion.span
                              key="smoke"
                              className="absolute -top-2 left-1/2 block size-2 -translate-x-1/2 rounded-full bg-white/40 blur-[2px]"
                              initial={{ y: 0, opacity: 0.7 }}
                              animate={{ y: -16, opacity: 0 }}
                              transition={{ duration: 1.2 }}
                            />
                          )}
                        </AnimatePresence>
                      </span>
                      <span className="block h-12 w-2.5 rounded-sm border border-white/25 bg-gradient-to-b from-white/90 to-white/50" />
                    </button>
                  ))}
                </div>
                <div className="mt-2 h-2 w-40 rounded-full bg-white/20" />
                <div className="h-12 w-44 rounded-t-xl bg-gradient-to-b from-primary/80 to-primary/60" />
                <div className="h-10 w-48 rounded-b-xl bg-gradient-to-b from-coral/80 to-coral/60" />
                <div className="mt-1 h-3 w-52 rounded-full bg-white/15" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {allOut && (
        <button
          type="button"
          onClick={reset}
          className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card"
        >
          <RotateCcw className="size-3.5" />
          Replay
        </button>
      )}
    </ExperienceFrame>
  );
}
