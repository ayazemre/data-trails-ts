export function sync<T extends (...args: any[]) => any>(fn: T): Result<ReturnType<T>, Error> {
	let returnValue;

	try {
		returnValue = fn();
	} catch (error) {
		Error.isError(error) ? (returnValue = error) : (returnValue = new Error("", { cause: error }));
	}

	return {
		isError() {
			return Error.isError(returnValue);
		},

		unwrapError() {
			if (Error.isError(returnValue)) {
				returnValue.name = "ResultError";
				return returnValue;
			}
			throw new Error("Wrapped result is not an error. Use isError helper.");
		},

		mapError(fn: (error: Error) => any) {
			if (Error.isError(returnValue)) {
				fn(returnValue);
				return this;
			} else {
				throw new Error("Wrapped result is not an error. Use isError helper.");
			}
		},

		unwrap() {
			if (Error.isError(returnValue)) {
				throw new Error("Wrapped result is an error. Use isError helper.");
			}
			return returnValue;
		},
	};
}

export async function async<T extends Promise<any>>(fn: T): Promise<Result<Awaited<T>, Error>> {
	let returnValue;

	try {
		returnValue = await fn;
	} catch (error) {
		Error.isError(error) ? (returnValue = error) : (returnValue = new Error("", { cause: error }));
	}

	return {
		isError() {
			return Error.isError(returnValue);
		},

		unwrapError() {
			if (Error.isError(returnValue)) {
				returnValue.name = "ResultError";
				return returnValue;
			}
			throw Error("Tried to unwrap a value as error. Use isError helper.");
		},

		mapError(fn: (error: Error) => any) {
			if (Error.isError(returnValue)) {
				fn(returnValue);
				return this as Result<Awaited<T>, Error>;
			} else {
				throw new Error("Wrapped result is not an error. Use isError helper.");
			}
		},

		unwrap() {
			if (Error.isError(returnValue)) {
				throw Error("Tried to unwrap an error as value. Use isError helper.");
			}
			return returnValue;
		},
	};
}

export const Result = { async, sync };

export type Result<T, Error> = {
	unwrap(): T;
	unwrapError(): Error;
	mapError(fn: (error: Error) => unknown): Result<T, Error>;
	isError(): boolean;
};
