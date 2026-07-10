import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",

  aiProvider: (process.env.AI_PROVIDER ?? "openai") as "openai" | "anthropic",
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
  },

  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB ?? 5),
  batchSize: Number(process.env.BATCH_SIZE ?? 25),
  batchConcurrency: Number(process.env.BATCH_CONCURRENCY ?? 4),
  maxRows: Number(process.env.MAX_ROWS ?? 5000),
};

export function assertProviderConfigured() {
  if (config.aiProvider === "openai" && !config.openai.apiKey) {
    throw new Error("AI_PROVIDER=openai but OPENAI_API_KEY is not set");
  }
  if (config.aiProvider === "anthropic" && !config.anthropic.apiKey) {
    throw new Error("AI_PROVIDER=anthropic but ANTHROPIC_API_KEY is not set");
  }
}
