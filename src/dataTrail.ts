import { Result } from "./index.ts";
import type { AsyncDataTrail, AsyncFunction } from "./types.ts";

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
