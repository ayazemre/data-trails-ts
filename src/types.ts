//TODO: Prevent sync trail to get async input
// export type NotAPromise<T> = T extends Promise<any> ? never : T;

export type AsyncFunction = (...args: any[]) => Promise<unknown>;
export type SyncFunction = (...args: any[]) => unknown;

export type ChainAsyncFunction<T extends AsyncFunction> = (previousValue: Awaited<ReturnType<T>>) => Promise<any>;
export type ChainSyncFunction<T extends SyncFunction> = (previousValue: ReturnType<T>) => any;

export type Result<T, Error> = {
	unwrap(): T;
	unwrapError(): Error;
	isError(): boolean;
};

export type AsyncDataTrail<T extends AsyncFunction> = {
	trail: Array<Function>;
	chain<U extends ChainAsyncFunction<T>>(fn: U): AsyncDataTrail<U>;
	run(): Promise<Result<Awaited<ReturnType<T>>, Error>>;
};

export type SyncDataTrail<T extends SyncFunction> = {
	trail: Array<Function>;
	chain<U extends ChainSyncFunction<T>>(fn: U): SyncDataTrail<U>;
	run(): Result<ReturnType<T>, Error>;
};
