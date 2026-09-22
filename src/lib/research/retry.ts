type RetryOptions = {
  retries?: number;
  baseDelayMs?: number;
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const retries = options.retries ?? 2;
  const baseDelayMs = options.baseDelayMs ?? 500;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === retries) {
        break;
      }

      const delay = baseDelayMs * Math.pow(2, attempt);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
