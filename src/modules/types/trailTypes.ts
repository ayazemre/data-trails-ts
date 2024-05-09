import { AsyncFragment, Fragment } from "./fragmentTypes";

export type Trail = Array<Fragment<any>>;

export type AsyncTrail = Array<AsyncFragment<any> | Fragment<any>>;


export type TrailError = {
    code: string;
    error: string;
    stack: string;
    message: string;
};

export type LastFragment<T extends Trail | AsyncTrail> = T extends [...infer I, infer L] ? L : never;

type LastReturnType<T extends any[]> = T extends [...infer _, infer Func] ? Func extends (...args: any[]) => infer R ? R : never : never;
