import type { LlmProvider, RawRow } from "./llm-provider.interface";
import { buildPrompt } from "./prompt";

interface GeminiConfig {
  apiKey: string;
  model: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiProvider implements LlmProvider {
  constructor(private config: GeminiConfig) {}

  async extractBatch(rows: RawRow[], headers: string[]): Promise<unknown[]> {
    const prompt = buildPrompt(rows, headers);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`;

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
      throw new Error(
        `Gemini request failed (${response.status}): ${errorBody}`
      );
    }

    const data: GeminiResponse = await response.json();

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Gemini response missing expected content");
    }

    const textContent = data.candidates[0].content.parts[0].text;

    // Extract JSON from markdown code blocks if present
    const jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonText = jsonMatch ? jsonMatch[1] : textContent;

    try {
      return JSON.parse(jsonText.trim());
    } catch (err) {
      throw new Error(`Failed to parse Gemini JSON response: ${err instanceof Error ? err.message : "unknown"}`);
    }
  }
}
