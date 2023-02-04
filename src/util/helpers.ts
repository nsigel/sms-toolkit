interface TryRetryOptions {
  // Maximum amount of times to try (defaults to Infinity)
  maxTries?: number;
  // Delay (in MS) between subsequent retries (after failing) (defaults to this.config.retryDelay)
  delay?: number;
  // Hook is called in case of any errors
  onError?: (err: Error) => void;
}

export const sleep = (delay: number) => new Promise((res) => setTimeout(res, delay));

export const tryRetry = async <T>(
  fn: () => Promise<T>,
  { delay = 0, maxTries = Infinity, onError }: TryRetryOptions
): Promise<T | Error> => {
  for (let attempt = 1; attempt <= maxTries; attempt++) {
    try {
      const val = await fn();

      return val;
    } catch (err: any) {
      if (onError) {
        onError(err);
      }

      if (attempt === maxTries) {
        return err as Error;
      }

      console.log(err);
      await sleep(delay);
    }
  }
  return Error("Retry failed");
};
