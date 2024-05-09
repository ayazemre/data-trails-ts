import { isFragmentError } from "../utils/isFragmentError";
import { AsyncTrail, LastFragment, Trail } from "../types/trailTypes";
import { AsyncFragment, Callable, Fragment, PromiseCallable, UnwrapFragmentResult } from "../types/fragmentTypes";

export function addFragment<T extends Trail | AsyncTrail, F extends Fragment<any> | AsyncFragment<any>>(fragment: F, trail: T) {
    trail.push(fragment);
};

export function runAsyncTrail(initialValue: unknown) {
    const taskCount = this.tasks.length;
    if (taskCount < 1 || !initialValue) {
        return "Error";
    }
    return this.tasks.reduce(async (p, c: AsyncFragment<any> | Fragment<any>) => {
        const res = await c(p);
        console.log(isFragmentError(res));
        return res;
    }, initialValue);
};

export function runTrail<T extends Trail | AsyncTrail>(trail: T, initialValue: any) {
    const taskCount = trail.length;
    if (taskCount < 1 || !initialValue) {
        return "Error";
    }
    return trail.reduce((p, c: Fragment<any>) => {
        const res = c(p);
        console.log(isFragmentError(res));
        return res;
    }, initialValue);
};