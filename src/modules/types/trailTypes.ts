type OmitFirstElement<A extends unknown[]> = A extends [infer Head, ...infer Tail] ? Tail : never;
type AdditionalArgs<F extends Fragment<any>> = OmitFirstElement<Parameters<F>>;



type Trail = {
    tasks: Array<Fragment<any>>,
    addFragment: <T extends Fragment<any>>(fragment: T, additionalArgs?: AdditionalArgs<T>) => void;
    runWorkflow: any;
    debug: any;
};