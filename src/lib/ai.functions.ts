import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";
import { getAiText } from "./ai.server";

const inputSchema = z.object({
  occasion: z.string().trim().min(1).max(120),
  relationship: z.string().trim().min(1).max(120),
  tone: z.string().trim().min(1).max(60),
  recipientName: z.string().trim().max(60).optional().default(""),
});

export type DraftMessageInput = z.input<typeof inputSchema>;
export type DraftMessageResult = { ok: true; text: string } | { ok: false; error: string };

export const draftCardMessage = createServerFn({ method: "POST" })
  .inputValidator((data: DraftMessageInput) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<DraftMessageResult> => {
    const request = getRequest();
    const recipient = data.recipientName ? data.recipientName : "someone special";

    const instructions = [
      "You write short, warm greeting-card messages for an Indian digital card platform called HeartMuse.",
      "Write ONE message the sender will send as-is. Requirements:",
      `- Occasion: ${data.occasion}`,
      `- The sender is writing to ${recipient} (their relationship: ${data.relationship})`,
      `- Tone: ${data.tone}`,
      "- 40 to 90 words, natural English, emotionally sincere, easy to read aloud.",
      "- No quotation marks around the message, no headings, no bullet points, no emojis.",
      "- Do not include a signature or sign-off; the sender's name appears separately on the card.",
      "- Refer to the recipient directly, as if written from one person to one person.",
    ].join("\n");

    return await getAiText(
      {
        instructions,
        messages: [
          {
            role: "user",
            content: `Write the card message for ${recipient} for this ${data.occasion}, in a ${data.tone} tone.`,
          },
        ],
        maxCharacters: 2000,
      },
      request,
    );
  });
