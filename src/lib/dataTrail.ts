import { Result } from "./result.ts";

export function createSyncTrail<T extends SyncFunction>(entryPoint: T): SyncDataTrail<T> {
	return {
		trail: [entryPoint],
		// @ts-ignore TODO: Fix type error
		chain(fn) {
			this.trail.push(fn);
			return this;
		},
		run() {
			let result = Result.sync(() => this.trail[0]());

			for (let index = 1; index < this.trail.length; index++) {
				if (result.isError()) {
					break;
				}
				result = Result.sync(() => this.trail[index](result.unwrap()));
			}

			return result;
		},
	};
}

export function createAsyncTrail<T extends AsyncFunction>(entryPoint: T): AsyncDataTrail<T> {
	return {
		trail: [entryPoint],
		// @ts-ignore TODO: Fix type error
		chain(fn) {
			this.trail.push(fn);
			return this;
		},
		async run() {
			let result = await Result.async(this.trail[0]());

			for (let index = 1; index < this.trail.length; index++) {
				if (result.isError()) {
					break;
				}
				result = await Result.async(this.trail[index](result.unwrap()));
			}

			return result;
		},
	};
}

export const DataTrail = { createAsyncTrail, createSyncTrail };

//TODO: Prevent sync trail to get async input
// export type NotAPromise<T> = T extends Promise<any> ? never : T;

export type AsyncFunction = (...args: any[]) => Promise<unknown>;
export type SyncFunction = (...args: any[]) => unknown;

export type ChainAsyncFunction<T extends AsyncFunction> = (previousValue: Awaited<ReturnType<T>>) => Promise<any>;
export type ChainSyncFunction<T extends SyncFunction> = (previousValue: ReturnType<T>) => any;

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
