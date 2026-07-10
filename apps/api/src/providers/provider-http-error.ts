/**
 * Error thrown when an HTTP request to an LLM provider fails.
 * Tracks whether the error is retryable (5xx, timeouts) or not (4xx auth/validation).
 */
export class ProviderHttpError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public retryable: boolean
  ) {
    super(message);
    this.name = "ProviderHttpError";
  }
}
