export type Fragment<F extends (...args: any) => any> = (...args: Parameters<F>) => FragmentResult<FragmentSuccess<ReturnType<F>>, FragmentError>;

export type AsyncFragment<F extends (...args: any) => any> = (...args: Parameters<F>) => Promise<FragmentResult<FragmentSuccess<ReturnType<F>>, FragmentError>>;

export type FragmentResult<R, FragmentError> = FragmentSuccess<R> | FragmentError;

export type FragmentSuccess<S> = Exclude<S, null | undefined>;

export type FragmentError = {
    code: string;
    error: string;
    stack: string;
    message: string;
};

export enum FragmentErrorCodes {
    NullOrUndefinedResult = "NullOrUndefinedResult",
    ExceptionResult = "ExceptionResult",
    InputParameterMismatch = "InputParameterMismatch"
}