import { isFragmentError } from "../utils/isFragmentError";
import { AsyncTrail, LastFragment, Trail } from "../types/trailTypes";
import { AsyncFragment, Callable, Fragment, PromiseCallable, UnwrapFragmentResult } from "../types/fragmentTypes";


export function runAsyncTrail<T extends AsyncTrail>(trail: T, initialValue: any) {
    const taskCount = trail.length;
    if (taskCount < 1 || !initialValue) {
        return;
    }
    return trail.reduce(async (p, c: AsyncFragment<any> | Fragment<any>) => {
        return isFragmentError(p) ? p : c(p);
    }, initialValue);
};

export function runTrail<T extends Trail>(trail: T, initialValue: any) {
    const taskCount = trail.length;
    if (taskCount < 1 || !initialValue) {
        return;
    }
    return trail.reduce((p, c: Fragment<any>) => {
        return isFragmentError(p) ? p : c(p);
    }, initialValue);
};