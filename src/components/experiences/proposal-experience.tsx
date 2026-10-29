import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, RotateCcw, Sparkles } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";
import { ExperienceFrame, type ExperienceProps } from "./experience-frame";

type Stage = "sealed" | "question" | "answered" | "pause";

const HEARTS = [
  { top: "12%", left: "10%", size: 16, delay: 0 },
  { top: "24%", left: "82%", size: 20, delay: 0.7 },
  { top: "58%", left: "6%", size: 14, delay: 1.3 },
  { top: "70%", left: "88%", size: 18, delay: 0.4 },
  { top: "38%", left: "92%", size: 12, delay: 1.8 },
  { top: "82%", left: "22%", size: 14, delay: 1 },
];

export function ProposalExperience({ personalization, mode = "live" }: ExperienceProps) {
  const [stage, setStage] = useState<Stage>("sealed");

  const answer = (yes: boolean) => {
    if (yes) {
      setStage("answered");
      void fireConfetti();
    } else {
      setStage("pause");
    }
  };

  return (
    <ExperienceFrame className={mode === "demo" ? "h-full" : ""}>
      {HEARTS.map((heart, i) => (
        <motion.span
          key={i}
          className="absolute text-coral/60"
          style={{ top: heart.top, left: heart.left }}
          animate={{ y: [0, -14, 0], opacity: [0.35, 0.8, 0.35] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: heart.delay }}
        >
          <Heart style={{ width: heart.size, height: heart.size }} fill="currentColor" />
        </motion.span>
      ))}

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
        <AnimatePresence mode="wait">
          {stage === "sealed" && (
            <motion.button
              key="sealed"
              type="button"
              onClick={() => setStage("question")}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.06 }}
              transition={{ duration: 0.4 }}
              className="group flex flex-col items-center gap-4 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <motion.span
                className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-coral to-primary shadow-lg"
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <Heart className="size-9 fill-current text-primary-foreground" />
              </motion.span>
              <p className="font-display text-2xl font-semibold text-foreground">
                Something is waiting for {personalization.recipientName}
              </p>
              <p className="text-sm text-muted-foreground">
                Tap the heart to open it
              </p>
            </motion.button>
          )}

          {stage === "question" && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {personalization.senderName} asks
              </p>
              <p className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
                <span className="text-gradient-violet">Will you marry me,</span>
              </p>
              <p className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                {personalization.recipientName}?
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => answer(true)}
                  className="rounded-xl bg-coral px-6 py-3 text-sm font-semibold text-coral-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Yes, a thousand times
                </button>
                <button
                  type="button"
                  onClick={() => answer(false)}
                  className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  I need a moment
                </button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Either answer is completely okay — this moment is yours.
              </p>
            </motion.div>
          )}

          {stage === "pause" && (
            <motion.div
              key="pause"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <Heart className="size-8 fill-current text-coral" />
              <p className="mt-4 font-display text-xl font-semibold text-foreground">
                Take all the time you need.
              </p>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                No pressure, no hurry. Whenever you're ready, the question will still be
                here — and so will {personalization.senderName}.
              </p>
              <button
                type="button"
                onClick={() => setStage("question")}
                className="mt-5 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Back to the question
              </button>
            </motion.div>
          )}

          {stage === "answered" && (
            <motion.div
              key="answered"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Sparkles className="size-7 text-amber-300" />
              <p className="mt-2 font-display text-3xl font-bold text-foreground">
                She said yes to {personalization.recipientName}!
              </p>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {personalization.message}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Forever yours, {personalization.senderName}
              </p>
              {personalization.photos.length > 0 && (
                <div className="mt-5 flex justify-center gap-2">
                  {personalization.photos.slice(0, 3).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Memory ${i + 1}`}
                      className="size-14 rounded-full border-2 border-coral/40 object-cover"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {stage === "answered" && (
        <button
          type="button"
          onClick={() => setStage("sealed")}
          className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card"
        >
          <RotateCcw className="size-3.5" />
          Replay
        </button>
      )}
    </ExperienceFrame>
  );
}
