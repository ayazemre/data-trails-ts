export type Callable = (...args: any) => unknown;
export type PromiseCallable = (...args: any) => Promise<unknown>;

export type Fragment<F extends Callable> = (...args: Parameters<F>) => FragmentResult<FragmentSuccess<ReturnType<F>>, FragmentError>;

export type FragmentResult<S, FragmentError> = FragmentSuccess<S> | FragmentError;

export type FragmentSuccess<S> = Exclude<S, null | undefined>;

export type FragmentError = {
    code: string;
    error: string;
    stack: string;
    message: string;
};

export type AsyncFragment<F extends PromiseCallable> = (...args: Parameters<F>) => Promise<FragmentResult<FragmentSuccess<Awaited<ReturnType<F>>>, FragmentError>>;

export enum FragmentErrorCodes {
    NullOrUndefinedResult = "NullOrUndefinedResult",
    ExceptionResult = "ExceptionResult",
    InputParameterMismatch = "InputParameterMismatch"
}


export type UnwrapFragmentResult<F extends Fragment<any>> = ReturnType<F>;  