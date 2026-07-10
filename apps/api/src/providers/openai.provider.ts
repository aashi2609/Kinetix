import { config } from "../config";
import type { LlmProvider, RawExtraction, RawRow } from "./llm-provider.interface";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export class OpenAiProvider implements LlmProvider {
  async extractBatch(rows: RawRow[], headers: string[]): Promise<RawExtraction[]> {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.openai.apiKey}`,
      },
      body: JSON.stringify({
        model: config.openai.model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content:
              buildUserPrompt(rows, headers) +
              `\n\nRespond with a JSON object of the form {"records": [...]} containing exactly ${rows.length} items.`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`OpenAI request failed (${res.status}): ${body.slice(0, 300)}`);
    }

    const data = (await res.json()) as {
      choices: { message: { content: string } }[];
    };

    const raw = data.choices?.[0]?.message?.content ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("OpenAI returned non-JSON content");
    }

    const records = (parsed as { records?: unknown[] }).records;
    if (!Array.isArray(records)) {
      throw new Error("OpenAI response missing 'records' array");
    }
    return records as RawExtraction[];
  }
}
