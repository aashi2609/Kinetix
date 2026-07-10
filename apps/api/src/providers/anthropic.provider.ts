import { config } from "../config";
import type { LlmProvider, RawExtraction, RawRow } from "./llm-provider.interface";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

export class AnthropicProvider implements LlmProvider {
  async extractBatch(rows: RawRow[], headers: string[]): Promise<RawExtraction[]> {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.anthropic.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.anthropic.model,
        max_tokens: 4096,
        temperature: 0,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content:
              buildUserPrompt(rows, headers) +
              `\n\nRespond with ONLY a raw JSON array (no markdown fences, no preamble) of exactly ${rows.length} objects.`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Anthropic request failed (${res.status}): ${body.slice(0, 300)}`);
    }

    const data = (await res.json()) as { content: { type: string; text?: string }[] };
    const text = data.content?.find((b) => b.type === "text")?.text ?? "[]";
    const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error("Anthropic returned non-JSON content");
    }

    if (!Array.isArray(parsed)) {
      throw new Error("Anthropic response is not a JSON array");
    }
    return parsed as RawExtraction[];
  }
}
