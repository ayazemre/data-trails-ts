import { type Result } from "./types.ts";

export function sync<T extends (...args: any[]) => any>(fn: T): Result<ReturnType<T>, Error> {
	let returnValue;

	try {
		returnValue = fn();
	} catch (error) {
		Error.isError(error) ? (returnValue = error) : (returnValue = new Error("", { cause: error }));
	}

	return {
		unwrap() {
			if (Error.isError(returnValue)) {
				throw returnValue;
			}
			return returnValue;
		},
		unwrapError() {
			if (Error.isError(returnValue)) {
				returnValue.name = "ResultError";
				return returnValue;
			}
			throw returnValue;
		},
		isError() {
			return Error.isError(returnValue);
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
		unwrap() {
			if (Error.isError(returnValue)) {
				throw Error("Tried to unwrap an error as value. Use isError helper.");
			}
			return returnValue;
		},
		unwrapError() {
			if (Error.isError(returnValue)) {
				returnValue.name = "ResultError";
				return returnValue;
			}
			throw Error("Tried to unwrap a value as error. Use isError helper.");
		},
		isError() {
			return Error.isError(returnValue);
		},
	};
}
