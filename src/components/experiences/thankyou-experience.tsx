import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, RotateCcw } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";
import { ExperienceFrame, type ExperienceProps } from "./experience-frame";

type Stage = "gift" | "opening" | "letter";

export function ThankYouExperience({ personalization, mode = "live" }: ExperienceProps) {
  const [stage, setStage] = useState<Stage>("gift");

  const open = () => {
    setStage("opening");
    window.setTimeout(() => {
      setStage("letter");
      void fireConfetti();
    }, 900);
  };

  return (
    <ExperienceFrame className={`${mode === "demo" ? "h-full" : ""} bg-gradient-to-b from-night-wash to-amber-950/40`}>
      {stage !== "letter" && (
        <div className="absolute right-6 top-6 size-24 rounded-full bg-amber-300/15 blur-2xl" />
      )}

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
        <AnimatePresence mode="wait">
          {stage === "gift" && (
            <motion.button
              key="gift"
              type="button"
              onClick={open}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-4 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <motion.span
                className="flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 shadow-xl"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gift className="size-11 text-amber-950" />
              </motion.span>
              <p className="font-display text-2xl font-semibold text-foreground">
                A wrapped thank you for {personalization.recipientName}
              </p>
              <p className="text-sm text-muted-foreground">Tap the gift to untie the ribbon</p>
            </motion.button>
          )}

          {stage === "opening" && (
            <motion.div key="opening" className="flex flex-col items-center gap-3">
              <motion.span
                className="block h-1.5 w-28 origin-center rounded-full bg-amber-300"
                initial={{ scaleX: 1, rotate: 0, opacity: 1 }}
                animate={{ scaleX: 0.1, rotate: 12, opacity: 0 }}
                transition={{ duration: 0.7 }}
              />
              <motion.span
                className="flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 shadow-xl"
                animate={{ y: [0, 10, -24], rotate: [0, 4, -6] }}
                transition={{ duration: 0.9 }}
              >
                <Gift className="size-11 text-amber-950" />
              </motion.span>
            </motion.div>
          )}

          {stage === "letter" && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 30, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}
              className="w-full max-w-xs rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-6 text-left shadow-xl"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-800">
                With gratitude
              </p>
              <p className="mt-2 font-display text-2xl font-semibold text-amber-950">
                Dear {personalization.recipientName},
              </p>
              <p className="mt-3 font-display text-sm italic leading-relaxed text-amber-900">
                {personalization.message}
              </p>
              <p className="mt-4 text-right text-xs font-medium text-amber-800">
                — {personalization.senderName}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {stage === "letter" && personalization.photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.45 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              A few little reminders
            </p>
            <div className="flex gap-2">
              {personalization.photos.slice(0, 3).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Memory ${i + 1}`}
                  className="size-14 rounded-lg border-2 border-amber-300/50 object-cover"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {stage === "letter" && (
        <button
          type="button"
          onClick={() => setStage("gift")}
          className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card"
        >
          <RotateCcw className="size-3.5" />
          Replay
        </button>
      )}
    </ExperienceFrame>
  );
}
