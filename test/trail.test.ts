export function workflowTester() {
    const workflow = createWorkflow();
    const testFragment = fragmentTransformer(testfn, "Test 1 Error Message");
    const testFragment2 = fragmentTransformer(testfn2, "Test 2 Error Message");
    workflow.addFragment(testFragment, [3]);
    workflow.addFragment(testFragment2, [3]);
    const wfResult = workflow.runWorkflow("s");
    console.log(wfResult);
}

workflowTester();


import { expect, test } from 'vitest';


test('Basic Trail Test', () => {

});