import rateLimit from "express-rate-limit";

// The import route triggers paid LLM calls — rate limit it specifically,
// tighter than any general-purpose limiter on the rest of the API.
export const importRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many import requests. Please try again later." },
});
