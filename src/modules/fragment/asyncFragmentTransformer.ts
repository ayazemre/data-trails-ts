import { Fragment, FragmentError, FragmentErrorCodes, FragmentSuccess } from "../types/fragmentTypes";

export async function asyncFragmentTransformer<T extends (...args: any) => any>(
    fn: T, onErrorMessage: string, isSafe = false): Promise<Fragment<T>> {
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




export async function asyncFragmentTransformer<T extends (...args: any[]) => any>(
    fn: T,
    args: Parameters<T>,
    onErrorMessage: string): Promise<FragmentResult<FragmentSuccess<ReturnType<T>>, FragmentError>> {
    try {
        const result: Awaited<ReturnType<T>> = await fn(...args);
        if (result === null || result === undefined) {
            const error: FragmentError = {
                code: FragmentErrorCodes.NullOrUndefined,
                error: "Fragment could not compute expected result. Transformed function returned" + `${result}`,
                stack: `${Error().stack}`.slice(0, 500),
                message: onErrorMessage
            };
            return error;
        } else {
            return result;
        }
    } catch (error) {
        if (error instanceof Error) {
            const err: FragmentError = {
                code: FragmentErrorCodes.ExceptionCaught,
                error: error.message,
                stack: `${error.stack}`.slice(0, 500),
                message: onErrorMessage
            };
            return err;
        } else {
            const err: FragmentError = {
                code: FragmentErrorCodes.ExceptionCaught,
                error: "An exception thrown on catch block which is not an instance of base Error type.",
                stack: `${Error().stack}`.slice(0, 500),
                message: onErrorMessage
            };
            return err;
        }
    }

};

