import { expect, expectTypeOf, test } from 'vitest';
import { fragmentTransformer } from '../src/modules/fragment/fragmentTransformer';
import { FragmentError, FragmentErrorCodes, FragmentResult, FragmentSuccess } from '../src/modules/types/fragmentTypes';
import { isFragmentError } from '../src/modules/utils/isFragmentError';
import { TestObject, caughtFragmentError, nullFragmentError, nullOrUndefinedFunction, numberReturn, objectReturn, stringReturn, throwFunction, undefinedFragmentError } from './utils';


test('Fragment Catch Null', () => {
    nullFragmentError.message = "Null Error Test";
    const fragment = fragmentTransformer(nullOrUndefinedFunction, "Null Error Test");
    const result = fragment(1);
    expect(result.code).toBe(FragmentErrorCodes.NullOrUndefinedResult);
    expect(result.error).toBe("Fragment could not compute expected result. Transformed function returned null.");
    expect(result.stack).toBeTypeOf(typeof nullFragmentError.stack);
    expect(result.message).toBe("Null Error Test");
});


test('Fragment Catch Undefined', () => {
    undefinedFragmentError.message = "Undefined Error Test";
    const fragment = fragmentTransformer(nullOrUndefinedFunction, "Undefined Error Test");
    const result = fragment(0.5);
    expect(result.code).toBe(FragmentErrorCodes.NullOrUndefinedResult);
    expect(result.error).toBe("Fragment could not compute expected result. Transformed function returned undefined.");
    expect(result.stack).toBeTypeOf(typeof nullFragmentError.stack);
    expect(result.message).toBe("Undefined Error Test");
});


test('Fragment Catch Throw', () => {
    caughtFragmentError.message = "Thrown Error Test";
    const fragment = fragmentTransformer(throwFunction, "Thrown Error Test");
    const result = fragment();
    if (isFragmentError(result)) {
        expect(result.code).toBe(FragmentErrorCodes.ExceptionResult);
        expect(result.error).toBe("Fragment could not compute expected result. Transformed function threw. Here is the error: Error: error");
        expect(result.stack).toBeTypeOf(typeof caughtFragmentError.stack);
        expect(result.message).toBe("Thrown Error Test");
    }
});


test('Fragment String Result', () => {
    const fragment = fragmentTransformer(stringReturn, "Could not compute a string");
    const result = fragment();
    expect(result).toBe("test");
});

test('Fragment Number Result', () => {
    const fragment = fragmentTransformer(numberReturn, "Could not compute a number");
    const result = fragment();
    expect(result).toBe(42);
});

test('Fragment Object Result', () => {
    const fragment = fragmentTransformer(objectReturn, "Could not compute a object");
    const result = fragment();
    expect(result).toStrictEqual({ a: "test", b: 42 });
    expectTypeOf(result).toEqualTypeOf<FragmentResult<TestObject, FragmentError>>();
});