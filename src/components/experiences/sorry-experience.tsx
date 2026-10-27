import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, RotateCcw } from "lucide-react";
import { ExperienceFrame, type ExperienceProps } from "./experience-frame";

type HugBurst = { id: number; offset: number };

export function SorryExperience({ personalization, mode = "live" }: ExperienceProps) {
  const [stage, setStage] = useState<"sealed" | "opening" | "open">("sealed");
  const [hugs, setHugs] = useState(0);
  const [bursts, setBursts] = useState<HugBurst[]>([]);

  const openEnvelope = () => {
    if (stage !== "sealed") return;
    setStage("opening");
    window.setTimeout(() => setStage("open"), 950);
  };

  const sendHug = () => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setHugs((n) => n + 1);
    setBursts((prev) => [...prev.slice(-8), { id, offset: ((hugs % 5) - 2) * 18 }]);
    window.setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 1100);
  };

  const reset = () => {
    setStage("sealed");
    setHugs(0);
    setBursts([]);
  };

  return (
    <ExperienceFrame className={mode === "demo" ? "h-full" : ""}>
      {stage !== "sealed" && (
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
        <AnimatePresence mode="wait">
          {stage !== "open" ? (
            <motion.div
              key="envelope"
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <p className="font-display text-2xl font-semibold text-foreground">
                Something for {personalization.recipientName}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Tap the seal to open</p>

              <button
                type="button"
                onClick={openEnvelope}
                aria-label="Open the letter"
                className="relative mt-8 block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {/* letter peeking behind the flap */}
                <motion.div
                  className="absolute inset-x-8 bottom-3 top-8 rounded-lg bg-card shadow-card"
                  animate={stage === "opening" ? { y: -80 } : { y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5, ease: "easeOut" }}
                />
                <div className="relative h-32 w-52 overflow-hidden rounded-xl border border-border bg-gradient-to-b from-lavender to-secondary shadow-card">
                  <motion.div
                    className="absolute inset-x-0 top-0 h-16 origin-top border-b border-border bg-secondary [clip-path:polygon(0_0,100%_0,50%_100%)]"
                    style={{ transformPerspective: 600 }}
                    animate={stage === "opening" ? { rotateX: 170 } : { rotateX: 0 }}
                    transition={{ duration: 0.5, ease: "easeIn" }}
                  />
                </div>
                {/* wax seal */}
                <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                  <motion.span
                    className="flex size-11 items-center justify-center rounded-full bg-coral text-coral-foreground shadow-lg"
                    animate={
                      stage === "opening"
                        ? { scale: 0, opacity: 0 }
                        : { scale: [1, 1.08, 1], opacity: 1 }
                    }
                    transition={
                      stage === "opening"
                        ? { duration: 0.3 }
                        : { duration: 1.6, repeat: Infinity }
                    }
                  >
                    <Heart className="size-5 fill-current" />
                  </motion.span>
                </span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-card"
            >
              <p className="font-display text-2xl font-semibold text-foreground">
                Dear {personalization.recipientName},
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                {personalization.message}
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                I'm sorry — {personalization.senderName}
              </p>
              <motion.div
                className="mx-auto mt-4 flex size-10 items-center justify-center rounded-full bg-coral text-coral-foreground"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="size-5 fill-current" />
              </motion.div>
              <div className="relative mt-4">
                {bursts.map((burst) => (
                  <span key={burst.id} className="pointer-events-none absolute inset-x-0 top-0">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.span
                        key={i}
                        className="absolute text-coral"
                        style={{ left: `calc(50% + ${burst.offset + (i - 2) * 14}px)` }}
                        initial={{ y: 0, opacity: 1, scale: 0.7 }}
                        animate={{ y: -70 - i * 8, opacity: 0, scale: 1.1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      >
                        <Heart className="size-3 fill-current" />
                      </motion.span>
                    ))}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={sendHug}
                  className="inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
                >
                  Send a hug back
                </button>
              </div>
              {hugs > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {hugs} {hugs === 1 ? "hug" : "hugs"} sent {personalization.senderName}'s way
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ExperienceFrame>
  );
}
