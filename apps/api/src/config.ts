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

  aiProvider: (process.env.AI_PROVIDER ?? "gemini") as "openai" | "anthropic" | "gemini",
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY ?? "",
    // Using the "-latest" alias instead of a pinned version (e.g. "gemini-2.5-flash")
    // on purpose: Google has been retiring specific model versions faster than this
    // project's release cycle in 2026. The alias is kept pointed at whatever Google's
    // current recommended Flash model is, so this stops breaking on every deprecation.
    // If you want a pinned, reproducible version instead, override GEMINI_MODEL directly —
    // check https://ai.google.dev/gemini-api/docs/models for what's currently live.
    model: process.env.GEMINI_MODEL ?? "gemini-flash-latest",
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
  if (config.aiProvider === "gemini" && !config.gemini.apiKey) {
    throw new Error("AI_PROVIDER=gemini but GEMINI_API_KEY is not set");
  }
}