import { AsyncFragment, FragmentError, FragmentErrorCodes, PromiseCallable } from "../types/fragmentTypes";

export function asyncFragmentTransformer<T extends PromiseCallable>(
    fn: T, onErrorMessage: string, isSafe = false): AsyncFragment<T> {
    return async (...args: Parameters<T>) => {
        let result;
        if (isSafe) {
            result = await fn(...args);
        } else {
            try {
                result = await fn(...args);
            } catch (error) {
                const err: FragmentError = {
                    code: FragmentErrorCodes.ExceptionResult,
                    error: "Fragment could not compute expected result. Transformed function threw. Here is the error: " + `${error}`,
                    stack: `${Error().stack}`.slice(0, 500),
                    message: onErrorMessage
                };
                return err;
            }
        }
        if (result === null || result === undefined) {
            const error: FragmentError = {
                code: FragmentErrorCodes.NullOrUndefinedResult,
                error: "Fragment could not compute expected result. Transformed function returned " + `${result}.`,
                stack: `${Error().stack}`.slice(0, 500),
                message: onErrorMessage
            };
            return error;
        } else {
            return result;
        }
    };
};