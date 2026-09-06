function wrap<T>(value: T): T extends Error ? Result<never, T> : Result<T, never> {
  return {
    isError() {
      return Error.isError(value);
    },

    mapError(fn: (error: Error) => Error) {
      if (Error.isError(value)) {
        return wrap(fn(value));
      } else {
        throw new Error("Wrapped result is not an error. Use isError helper.");
      }
    },

    unwrap() {
      if (Error.isError(value)) {
        throw new Error("Wrapped result is an error. Use isError helper.");
      }
      return value as any;
    },

    unwrapError() {
      if (Error.isError(value)) {
        return value as any;
      }
      throw new Error("Wrapped result is not an error. Use isError helper.");
    },
  } as any;
}

function from<T>(fn: () => Promise<T>): Promise<Result<T, Error>>;
function from<T>(fn: () => T): Result<T, Error>;
function from<T>(fn: () => T | Promise<T>): Result<T, Error> | Promise<Result<T, Error>> {
  try {
    const value = fn();
    if (value != null && typeof (value as Promise<T>).then === "function") {
      return (value as Promise<T>).then(
        (resolvedValue) => wrap(resolvedValue),
        (error) => normalizeError(error),
      ) as Promise<Result<T, Error>>;
    }
    return wrap(value as T);
  } catch (error) {
    return normalizeError(error);
  }
}

export const Result = { from, void: (): Result<void, Error> => wrap(undefined as unknown as void), wrap };

export type Result<T, E = Error> = {
  unwrap(): T;
  unwrapError(): E;
  mapError(fn: (error: E) => E): Result<T, E>;
  isError(): this is Result<never, E>;
};

// Helpers
function normalizeError(error: unknown) {
  return Error.isError(error) ? wrap(error) : wrap(new Error("", { cause: error }));
}
