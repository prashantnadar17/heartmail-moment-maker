import type { ModelMessage } from "ai";

/**
 * One-shot, final-text AI helper. Streams server-side and returns the
 * accumulated text, so callers stay simple and nothing buffers upstream.
 */
export type AiTextResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

export async function getAiText(
  args: {
    instructions: string;
    messages: ModelMessage[];
    /** Soft cap on returned characters; the text is trimmed to it. */
    maxCharacters?: number;
  },
  request: Request,
): Promise<AiTextResult> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "AI is not configured yet. Please try again later." };
  }

  try {
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const { createLovableAiGatewayRunIdFetch, LOVABLE_GATEWAY_URL, getLovableAiGatewayRunId } =
      await import("./ai-gateway.server");

    const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
    const provider = createOpenAI({
      baseURL: LOVABLE_GATEWAY_URL,
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      instructions: args.instructions,
      messages: args.messages,
      abortSignal: request.signal,
      providerOptions: {
        openai: {
          store: false,
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const text = (await result.text).trim();
    if (!text) {
      return { ok: false, error: "The AI returned an empty message. Please try again." };
    }
    const cap = args.maxCharacters ?? 2000;
    return { ok: true, text: text.length > cap ? `${text.slice(0, cap).trimEnd()}…` : text };
  } catch (error) {
    const message =
      error && typeof error === "object" && "message" in error
        ? String((error as { message?: unknown }).message)
        : "";
    // Surface only a safe, user-readable reason; never raw provider details.
    const friendly = message
      ? message.length > 200
        ? "The AI helper is unavailable right now. Please try again in a moment."
        : message
      : "The AI helper is unavailable right now. Please try again in a moment.";
    return { ok: false, error: friendly };
  }
}
