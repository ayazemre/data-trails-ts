import { DataTrail } from "./index.ts";

export type AsyncFunction = (...args: any[]) => Promise<unknown>;
export type ChainFunction<T extends AsyncFunction> = (previousValue: Awaited<ReturnType<T>>) => Promise<any>;

export type Result<T, Error> = {
	unwrap(): T;
	unwrapError(): Error;
	isError(): boolean;
};

export type AsyncDataTrail<T extends AsyncFunction> = {
	trail: Array<Function>;
	chain<U extends ChainFunction<T>>(fn: U): AsyncDataTrail<U>;
	run(): Promise<Result<Awaited<ReturnType<T>>, Error>>;
};
