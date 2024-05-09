import { expect, expectTypeOf, test } from 'vitest';
import { TestObject, asyncNullOrUndefinedFunction, asyncNumberReturn, asyncObjectReturn, asyncStringReturn, asyncThrowFunction, caughtFragmentError, nullFragmentError, nullOrUndefinedFunction, promiseRejection, rejectedPromiseAsyncFragmentError, undefinedFragmentError } from './utils';
import { asyncFragmentTransformer } from '../src/modules/fragment/asyncFragmentTransformer';
import { FragmentError, FragmentErrorCodes, FragmentResult } from '../src/modules/types/fragmentTypes';
import { isFragmentError } from '../src/modules/utils/isFragmentError';


test('AsyncFragment Catch Null', async () => {
    nullFragmentError.message = "Null Error Test";
    const fragment = asyncFragmentTransformer(asyncNullOrUndefinedFunction, "Null Error Test");
    const result = await fragment(1);
    expect(result.code).toBe(FragmentErrorCodes.NullOrUndefinedResult);
    expect(result.error).toBe("Fragment could not compute expected result. Transformed function returned null.");
    expect(result.stack).toBeTypeOf(typeof nullFragmentError.stack);
    expect(result.message).toBe("Null Error Test");

});


test('AsyncFragment Catch Undefined', async () => {
    undefinedFragmentError.message = "Undefined Error Test";
    const fragment = asyncFragmentTransformer(asyncNullOrUndefinedFunction, "Undefined Error Test");
    const result = await fragment(0.5);
    expect(result.code).toBe(FragmentErrorCodes.NullOrUndefinedResult);
    expect(result.error).toBe("Fragment could not compute expected result. Transformed function returned undefined.");
    expect(result.stack).toBeTypeOf(typeof nullFragmentError.stack);
    expect(result.message).toBe("Undefined Error Test");
});


test('AsyncFragment Catch Throw', async () => {
    caughtFragmentError.message = "Thrown Error Test";
    const fragment = asyncFragmentTransformer(asyncThrowFunction, "Thrown Error Test");
    const result = await fragment();
    if (isFragmentError(result)) {
        expect(result.code).toBe(FragmentErrorCodes.ExceptionResult);
        expect(result.error).toBe("Fragment could not compute expected result. Transformed function threw. Here is the error: Error: error");
        expect(result.stack).toBeTypeOf(typeof caughtFragmentError.stack);
        expect(result.message).toBe("Thrown Error Test");
    }
});

test('AsyncFragment Catch Promise Reject', async () => {
    rejectedPromiseAsyncFragmentError.message = "Promise Rejection Test";
    const fragment = asyncFragmentTransformer(promiseRejection, "Promise Rejection Test");
    const result = await fragment();
    console.log(result);

    if (isFragmentError(result)) {
        expect(result.code).toBe(FragmentErrorCodes.ExceptionResult);
        expect(result.error).toBe("Fragment could not compute expected result. Transformed function threw. Here is the error: foo");
        expect(result.stack).toBeTypeOf(typeof rejectedPromiseAsyncFragmentError.stack);
        expect(result.message).toBe("Promise Rejection Test");
    }
});


test('AsyncFragment String Result', async () => {
    const fragment = asyncFragmentTransformer(asyncStringReturn, "Could not compute a string");
    const result = await fragment();
    expect(result).toBe("test");
});

test('AsyncFragment Number Result', async () => {
    const fragment = asyncFragmentTransformer(asyncNumberReturn, "Could not compute a string");
    const result = await fragment();
    expect(result).toBe(42);
});

test('AsyncFragment Object Result', async () => {
    const fragment = asyncFragmentTransformer(asyncObjectReturn, "Could not compute a string");
    const result = await fragment();
    expect(result).toStrictEqual({ a: "test", b: 42 });
    expectTypeOf(result).toEqualTypeOf<FragmentResult<TestObject, FragmentError>>();
});