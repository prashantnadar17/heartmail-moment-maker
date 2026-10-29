import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, RotateCcw } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";
import { ExperienceFrame, type ExperienceProps } from "./experience-frame";

const MILESTONES = [
  { label: "Where it began", note: "One ordinary day that changed everything." },
  { label: "Every moment since", note: "The laughs, the trips, the quiet evenings." },
  { label: "Today & always", note: "Still my favourite person, every single day." },
];

type Stage = "intro" | "timeline" | "finale";

export function AnniversaryExperience({ personalization, mode = "live" }: ExperienceProps) {
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < MILESTONES.length - 1) {
      setStep((s) => s + 1);
    } else {
      setStage("finale");
      void fireConfetti();
    }
  };

  const video = personalization.videos[0];
  const milestone = MILESTONES[step] ?? MILESTONES[0]!;
  const photo = personalization.photos[Math.min(step, Math.max(personalization.photos.length - 1, 0))];

  return (
    <ExperienceFrame className={`${mode === "demo" ? "h-full" : ""} bg-gradient-to-b from-night-wash to-primary/20`}>
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.button
              key="intro"
              type="button"
              onClick={() => setStage("timeline")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-4 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <motion.span
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <Heart className="size-12 fill-current text-coral" />
              </motion.span>
              <p className="font-display text-2xl font-semibold text-foreground">
                {personalization.recipientName}, our story in three moments
              </p>
              <p className="text-sm text-muted-foreground">Tap the heart to walk the timeline</p>
            </motion.button>
          )}

          {stage === "timeline" && (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35 }}
              className="flex w-full max-w-xs flex-col items-center gap-4"
            >
              <div className="flex w-full items-center gap-2">
                {MILESTONES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= step ? "bg-coral" : "bg-white/15"
                    }`}
                  />
                ))}
              </div>
              {photo ? (
                <img
                  src={photo}
                  alt={MILESTONES[step].label}
                  className="h-40 w-full rounded-2xl border border-border object-cover"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-primary/30 to-coral/30">
                  <Heart className="size-8 fill-current text-primary-foreground/70" />
                </div>
              )}
              <div>
                <p className="font-display text-xl font-semibold text-foreground">
                  {MILESTONES[step].label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{MILESTONES[step].note}</p>
              </div>
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {step < MILESTONES.length - 1 ? "Next memory" : "Read my letter"}
                <ArrowRight className="size-4" />
              </button>
            </motion.div>
          )}

          {stage === "finale" && (
            <motion.div
              key="finale"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <p className="font-display text-3xl font-semibold text-foreground">
                <span className="text-gradient-violet">Happy anniversary,</span>
              </p>
              <p className="font-display text-3xl font-bold text-foreground">
                {personalization.recipientName}
              </p>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {personalization.message}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Always, {personalization.senderName}
              </p>
              {video && (
                <video
                  src={video}
                  controls
                  playsInline
                  preload="metadata"
                  className="mx-auto mt-5 w-full max-w-xs rounded-2xl border border-border"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {stage === "finale" && (
        <button
          type="button"
          onClick={() => {
            setStage("intro");
            setStep(0);
          }}
          className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card"
        >
          <RotateCcw className="size-3.5" />
          Replay
        </button>
      )}
    </ExperienceFrame>
  );
}
