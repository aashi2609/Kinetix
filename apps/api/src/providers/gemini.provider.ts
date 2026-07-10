import type { LlmProvider, RawRow, RawExtraction } from "./llm-provider.interface";
import { buildUserPrompt, SYSTEM_PROMPT } from "./prompt";
import { config } from "../config";
import { ProviderHttpError } from "./provider-http-error";

export class GeminiProvider implements LlmProvider {
  async extractBatch(rows: RawRow[], headers: string[]): Promise<RawExtraction[]> {
    const prompt = `${SYSTEM_PROMPT}\n\n${buildUserPrompt(rows, headers)}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent?key=${config.gemini.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const retryable = response.status >= 500 || response.status === 429;
      throw new ProviderHttpError(
        `Gemini request failed (${response.status}): ${errorBody}`,
        response.status,
        retryable
      );
    }

    const data = await response.json() as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
      }>;
    };

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Gemini response missing expected content");
    }

    const textContent = data.candidates[0].content.parts[0].text;

    // Extract JSON from markdown code blocks if present
    const jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonText = jsonMatch ? jsonMatch[1] : textContent;

    try {
      const parsed = JSON.parse(jsonText.trim());
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (err) {
      throw new Error(`Failed to parse Gemini JSON response: ${err instanceof Error ? err.message : "unknown"}`);
    }
  }
}
