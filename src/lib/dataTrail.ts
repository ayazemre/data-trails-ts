import { Result } from "../index.ts";
import type { AsyncDataTrail, AsyncFunction, SyncDataTrail, SyncFunction } from "./types.ts";

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
