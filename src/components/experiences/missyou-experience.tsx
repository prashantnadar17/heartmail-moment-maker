import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CloudMoon, Play, RotateCcw, Send } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";
import { ExperienceFrame, type ExperienceProps } from "./experience-frame";

const STARS = [
  { top: "10%", left: "12%", size: 2, delay: 0 },
  { top: "22%", left: "70%", size: 3, delay: 0.5 },
  { top: "16%", left: "44%", size: 2, delay: 1 },
  { top: "34%", left: "88%", size: 2, delay: 0.8 },
  { top: "42%", left: "8%", size: 3, delay: 1.4 },
  { top: "12%", left: "92%", size: 2, delay: 0.2 },
];

type Stage = "night" | "flying" | "letter";

export function MissYouExperience({ personalization, mode = "live" }: ExperienceProps) {
  const [stage, setStage] = useState<Stage>("night");
  const video = personalization.videos[0];

  const send = () => {
    setStage("flying");
    window.setTimeout(() => {
      setStage("letter");
      void fireConfetti();
    }, 1300);
  };

  return (
    <ExperienceFrame className={mode === "demo" ? "h-full" : ""}>
      {STARS.map((star, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-primary-foreground/70"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: star.delay }}
        />
      ))}

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
        <AnimatePresence mode="wait">
          {stage === "night" && (
            <motion.button
              key="night"
              type="button"
              onClick={send}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-4 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CloudMoon className="size-10 text-lavender" />
              <p className="font-display text-2xl font-semibold text-foreground">
                Miles apart, still close
              </p>
              <p className="text-sm text-muted-foreground">
                Send a paper plane to {personalization.recipientName}
              </p>
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                <Send className="size-4" />
                Send it flying
              </span>
            </motion.button>
          )}

          {stage === "flying" && (
            <motion.div key="flying" className="flex flex-col items-center gap-4">
              <motion.span
                className="text-4xl"
                initial={{ x: -90, y: 30, rotate: 8 }}
                animate={{ x: 90, y: -20, rotate: -6 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              >
                ✈️
              </motion.span>
              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.3 }}
              >
                Carrying your words across the miles…
              </motion.p>
            </motion.div>
          )}

          {stage === "letter" && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <p className="font-display text-3xl font-semibold text-foreground">
                <span className="text-gradient-violet">I miss you,</span>
              </p>
              <p className="font-display text-3xl font-bold text-foreground">
                {personalization.recipientName}
              </p>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {personalization.message}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Until we meet, {personalization.senderName}
              </p>
              {personalization.photos.length > 0 && (
                <div className="mt-4 flex justify-center gap-2">
                  {personalization.photos.slice(0, 3).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Memory ${i + 1}`}
                      className="size-14 rounded-lg border border-border object-cover"
                    />
                  ))}
                </div>
              )}
              {video && (
                <div className="mx-auto mt-5 w-full max-w-xs">
                  <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    <Play className="size-3" />
                    A little hello from {personalization.senderName}
                  </p>
                  <video
                    src={video}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full rounded-2xl border border-border"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {stage === "letter" && (
        <button
          type="button"
          onClick={() => setStage("night")}
          className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card"
        >
          <RotateCcw className="size-3.5" />
          Replay
        </button>
      )}
    </ExperienceFrame>
  );
}
