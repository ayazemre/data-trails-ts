import { FragmentError, FragmentErrorCodes } from "../src/modules/types/fragmentTypes";


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function nullOrUndefinedFunction(randomInt: number) {
    return randomInt < 1 ? undefined : null;
}

export async function asyncNullOrUndefinedFunction(randomInt: number) {
    await delay(100);
    return randomInt < 1 ? undefined : null;
}

export function throwFunction() {
    throw new Error("error");
}

export async function asyncThrowFunction() {
    await delay(100);
    throw new Error("error");
}

export function stringReturn() {
    return "test";
}

export async function asyncStringReturn() {
    await delay(100);
    return "test";
}

export function numberReturn() {
    return 42;
}

export async function asyncNumberReturn() {
    await delay(100);
    return 42;
}

export type TestObject = { a: string, b: number; };

export function objectReturn(): TestObject {
    return { a: "test", b: 42 };
}

export async function asyncObjectReturn(): Promise<TestObject> {
    await delay(100);
    return { a: "test", b: 42 };
}

export async function promiseRejection(): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("foo");
        }, 300);
    });
}

export const nullFragmentError: FragmentError = {
    code: FragmentErrorCodes.NullOrUndefinedResult,
    error: "Fragment could not compute expected result. Transformed function returned null",
    stack: `${Error().stack}`.slice(0, 500),
    message: ""
};

export const undefinedFragmentError: FragmentError = {
    code: FragmentErrorCodes.NullOrUndefinedResult,
    error: "Fragment could not compute expected result. Transformed function returned undefined",
    stack: `${Error().stack}`.slice(0, 500),
    message: ""
};

export const caughtFragmentError: FragmentError = {
    code: FragmentErrorCodes.NullOrUndefinedResult,
    error: "Fragment could not compute expected result. Transformed function threw",
    stack: `${Error().stack}`.slice(0, 500),
    message: ""
};


export const rejectedPromiseAsyncFragmentError: FragmentError = {
    code: FragmentErrorCodes.ExceptionResult,
    error: "Fragment could not compute expected result. Transformed function threw",
    stack: `${Error().stack}`.slice(0, 500),
    message: ""
};

