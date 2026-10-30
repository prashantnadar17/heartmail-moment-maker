import type { ComponentType } from "react";
import type { ExperiencePersonalization, ExperienceProps } from "@/components/experiences/experience-frame";
import { BirthdayExperience } from "@/components/experiences/birthday-experience";
import { SorryExperience } from "@/components/experiences/sorry-experience";
import { PhotoPuzzleExperience } from "@/components/experiences/photo-puzzle-experience";
import { ProposalExperience } from "@/components/experiences/proposal-experience";
import { AnniversaryExperience } from "@/components/experiences/anniversary-experience";
import { ThankYouExperience } from "@/components/experiences/thankyou-experience";
import { MissYouExperience } from "@/components/experiences/missyou-experience";

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
  /** At least one photo is required before the card can be saved. */
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
      videos: [],
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
      videos: [],
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
      videos: [],
    },
  },
  proposal: {
    name: "Marry Me Moment",
    emoji: "💍",
    component: ProposalExperience,
    needsPhotos: false,
    fields: baseFields(
      "You are my favourite person, my calm and my adventure. Say yes and let's make every day after this one ours.",
    ),
    steps: [
      "A glowing heart arrives with a question hidden inside",
      "They tap it — the big question appears, theirs to answer",
      "A yes bursts into confetti, your words and your photos together",
    ],
    demo: {
      recipientName: "Ishita",
      senderName: "Rohan",
      message:
        "You are my favourite person, my calm and my adventure. Say yes and let's make every day after this one ours.",
      photos: [],
      videos: [],
    },
  },
  anniversary: {
    name: "Anniversary Timeline",
    emoji: "💞",
    component: AnniversaryExperience,
    needsPhotos: false,
    fields: baseFields(
      "Every year with you reads better than the last. Here's to the chapter we write next.",
    ),
    steps: [
      "A beating heart opens your story in three moments",
      "They walk the timeline — each step shows a photo memory",
      "The finale: your letter and any video message you recorded",
    ],
    demo: {
      recipientName: "Saanvi",
      senderName: "Aditya",
      message:
        "Every year with you reads better than the last. Here's to the chapter we write next.",
      photos: [],
      videos: [],
    },
  },
  thankyou: {
    name: "Thank You Gift",
    emoji: "🎁",
    component: ThankYouExperience,
    needsPhotos: false,
    fields: baseFields(
      "Some people make the world lighter just by being in it. Thank you for being one of them.",
    ),
    steps: [
      "A wrapped golden gift waits for them",
      "They tap the ribbon — it unties and the box opens",
      "Your thank-you letter unfolds with a few photo reminders",
    ],
    demo: {
      recipientName: "Priya",
      senderName: "Karan",
      message:
        "Some people make the world lighter just by being in it. Thank you for being one of them.",
      photos: [],
      videos: [],
    },
  },
  missyou: {
    name: "Miss You Night Sky",
    emoji: "🌙",
    component: MissYouExperience,
    needsPhotos: false,
    fields: baseFields(
      "The miles are only numbers. Until we meet again, keep this little piece of me close.",
    ),
    steps: [
      "A quiet night sky with a paper plane ready to fly",
      "They send it soaring across the stars",
      "Your message lands, with photos and a video hello",
    ],
    demo: {
      recipientName: "Neha",
      senderName: "Arjun",
      message:
        "The miles are only numbers. Until we meet again, keep this little piece of me close.",
      photos: [],
      videos: [],
    },
  },
};

export function getExperience(type: string): ExperienceMeta | null {
  return experiences[type] ?? null;
}
