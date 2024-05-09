import { Callable, Fragment, FragmentError, FragmentErrorCodes, FragmentSuccess } from "../types/fragmentTypes";

export function fragmentTransformer<T extends Callable>(
    fn: T, onErrorMessage: string, isSafe = false): Fragment<T> {
    return (...args: Parameters<T>) => {
        let result;
        if (isSafe) {
            result = fn(...args);
        } else {
            try {
                result = fn(...args);
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


