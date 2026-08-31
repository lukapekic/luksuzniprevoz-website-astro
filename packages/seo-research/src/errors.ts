export class SeoResearchError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "SeoResearchError";
  }
}

export class ProviderError extends SeoResearchError {
  constructor(
    message: string,
    public readonly status: number | null,
    cause?: unknown,
  ) {
    super(message, "provider_error", cause);
    this.name = "ProviderError";
  }
}

export function messageFromUnknown(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
