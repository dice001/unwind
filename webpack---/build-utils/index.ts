export type RequireContext = ReturnType<typeof require.context>;

export function importAll<T>(requireContext: RequireContext): Array<T> {
  return requireContext.keys().map<T>(key => requireContext(key).default);
}

type RetryOptions = {
  times: number;
};

export function retry<TCallback extends (...args: Array<any>) => Promise<any>>(
  fn: TCallback,
  options?: Partial<RetryOptions>,
): TCallback {
  const mergedOptions: RetryOptions = {
    times: (options && options.times) || 1,
  };

  return ((...args: Array<any>) => {
    let result = fn(args);

    for (
      let retryCount = 0;
      retryCount < mergedOptions.times - 1;
      retryCount++
    ) {
      result = result.catch(() => {
        return fn(args);
      });
    }

    return result;
  }) as TCallback;
}
