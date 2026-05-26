function wrap<T>(value: T): T extends Error ? Result<never, T> : Result<T, Error> {
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
  } as T extends Error ? Result<never, T> : Result<T, Error>;
}

function sync<T>(fn: () => T): Result<T, Error> {
  try {
    return wrap(fn());
  } catch (error) {
    return normalizeError(error);
  }
}

async function async<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    return wrap(await fn());
  } catch (error) {
    return normalizeError(error);
  }
}

export const Result = { async, sync, void: (): Result<void, Error> => wrap(undefined as any), wrap };

export type Result<T, E = Error> = {
  unwrap(): T;
  unwrapError(): E;
  mapError(fn: (error: E) => E): Result<T, E>;
  isError(): boolean;
};

// Helpers
function normalizeError(error: unknown) {
  return Error.isError(error) ? wrap(error) : wrap(new Error("", { cause: error }));
}
