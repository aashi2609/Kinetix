import { config } from "../config";
import type { LlmProvider } from "./llm-provider.interface";
import { OpenAiProvider } from "./openai.provider";
import { AnthropicProvider } from "./anthropic.provider";

let cachedProvider: LlmProvider | null = null;

export function getLlmProvider(): LlmProvider {
  if (cachedProvider) return cachedProvider;

  switch (config.aiProvider) {
    case "openai":
      cachedProvider = new OpenAiProvider();
      break;
    case "anthropic":
      cachedProvider = new AnthropicProvider();
      break;
    default:
      throw new Error(`Unknown AI_PROVIDER: ${config.aiProvider}`);
  }
  return cachedProvider;
}
