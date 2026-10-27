import type { ComponentType } from "react";
import type { ExperiencePersonalization, ExperienceProps } from "@/components/experiences/experience-frame";
import { BirthdayExperience } from "@/components/experiences/birthday-experience";
import { SorryExperience } from "@/components/experiences/sorry-experience";
import { PhotoPuzzleExperience } from "@/components/experiences/photo-puzzle-experience";

export type ExperienceField = {
  key: "recipientName" | "senderName" | "message";
  label: string;
  placeholder: string;
  multiline?: boolean;
};

export type ExperienceMeta = {
  name: string;
  emoji: string;
  component: ComponentType<ExperienceProps>;
  needsPhotos: boolean;
  fields: ExperienceField[];
  steps: string[];
  demo: ExperiencePersonalization;
};

const baseFields = (messagePlaceholder: string): ExperienceField[] => [
  {
    key: "recipientName",
    label: "Who is this for?",
    placeholder: "e.g. Aarav",
  },
  {
    key: "senderName",
    label: "Your name",
    placeholder: "e.g. Diya",
  },
  {
    key: "message",
    label: "Your message",
    placeholder: messagePlaceholder,
    multiline: true,
  },
];

export const experiences: Record<string, ExperienceMeta> = {
  birthday: {
    name: "Birthday Cake Reveal",
    emoji: "🎂",
    component: BirthdayExperience,
    needsPhotos: false,
    fields: baseFields(
      "Another year of you being absolutely wonderful. May every candle you blow out come back as a wish come true.",
    ),
    steps: [
      "Five candles flicker on a midnight cake, waiting for them",
      "They tap each candle to blow it out — one by one",
      "The reveal: confetti bursts, their name lights up and your words appear",
    ],
    demo: {
      recipientName: "Aarav",
      senderName: "Diya",
      message:
        "Another year of you being absolutely wonderful. May every candle you blow out come back as a wish come true.",
      photos: [],
    },
  },
  sorry: {
    name: "Heartfelt Apology",
    emoji: "💌",
    component: SorryExperience,
    needsPhotos: false,
    fields: baseFields(
      "I have replayed that moment a hundred times. I am sorry — and I miss the easy laughs we used to share.",
    ),
    steps: [
      "A sealed envelope arrives with a beating wax heart",
      "They tap the seal — the flap lifts and the letter rises",
      "Your apology unfolds, and they can send a hug back",
    ],
    demo: {
      recipientName: "Kabir",
      senderName: "Meera",
      message:
        "I have replayed that moment a hundred times. I am sorry — and I miss the easy laughs we used to share.",
      photos: [],
    },
  },
  photo_puzzle: {
    name: "Surprise Photo Puzzle",
    emoji: "🧩",
    component: PhotoPuzzleExperience,
    needsPhotos: true,
    fields: baseFields(
      "Every piece of this puzzle is a memory with you. Piece it together, one smile at a time.",
    ),
    steps: [
      "Your photo hides behind nine numbered tiles",
      "They tap the tiles — each flip uncovers a piece of the picture",
      "The full photo appears with your message and extra memories",
    ],
    demo: {
      recipientName: "Anaya",
      senderName: "Vivaan",
      message:
        "Every piece of this puzzle is a memory with you. Piece it together, one smile at a time.",
      photos: [],
    },
  },
};

export function getExperience(type: string): ExperienceMeta | null {
  return experiences[type] ?? null;
}
