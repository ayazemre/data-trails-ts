import { expect, test } from 'vitest';
import { runTrail } from '../src/modules/trail/trailFunctions';
import { fragmentTransformer } from '../src/modules/fragment/fragmentTransformer';
import { numberReturn, stringReturn } from './utils';
import { Fragment, UnwrapFragmentResult } from '../src/modules/types/fragmentTypes';
import { Trail, LastFragment } from '../src/modules/types/trailTypes';


test('Basic Trail Test', () => {
    type LastReturnType<T extends any[]> = T extends [...infer _, infer Func] ? Func extends (...args: any[]) => infer R ? R : never : never;
    let testFragment = fragmentTransformer((a: number) => { return a; }, "test");
    let testFragment2 = fragmentTransformer((b: string) => { return b; }, "test");
    const testTrail = [testFragment, testFragment2];
    type test = UnwrapFragmentResult<typeof testTrail[1]>;
    const result = runTrail(testTrail, 1);
    expect(result).toBe("1");
});

