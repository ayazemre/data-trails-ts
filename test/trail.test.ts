import { expect, test } from 'vitest';
import { addFragment, runTrail } from '../src/modules/trail/trailFunctions';
import { fragmentTransformer } from '../src/modules/fragment/fragmentTransformer';
import { numberReturn, stringReturn } from './utils';
import { Fragment, UnwrapFragmentResult } from '../src/modules/types/fragmentTypes';
import { Trail, LastFragment } from '../src/modules/types/trailTypes';


test('Basic Trail Test', () => {
    let testFragment = fragmentTransformer((a: number) => { return a; }, "test");
    let testFragment2 = fragmentTransformer((b: string) => { return b; }, "test");
    const testTrail: Trail = [testFragment, testFragment2];
    const result = runTrail(testTrail, 1);
    expect(result).toBe("1");
});

