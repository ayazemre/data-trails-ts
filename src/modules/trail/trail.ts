import { isFragmentError } from "../fragment/fragmentTransformer";

export function createTrail(): Trail {
    return {
        tasks: [],
        addFragment: function <T extends Fragment<any>>(fragment: T, additionalArgs?: AdditionalArgs<T>) {
            this.tasks.push(fragment);
        },
        runWorkflow: function (initialValue: unknown) {
            const taskCount = this.tasks.length;
            if (taskCount < 1 || !initialValue) {
                return "Error";
            }
            return this.tasks.reduce((p, c: Fragment<any>) => {
                const res = c(p);
                console.log(res);
                return res;
            }, initialValue);
        },
        debug: function () {
            console.log(this.tasks);
        }
    };
};