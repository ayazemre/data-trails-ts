import { Result } from "./result.ts";

function createSyncTrail<T>(entryPoint: () => T): SyncDataTrail<T> {
  return {
    chain(fn) {
      this.trail.push(fn);
      return this as any;
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
    trail: [entryPoint],
  };
}

function createAsyncTrail<T>(entryPoint: () => Promise<T>): AsyncDataTrail<T> {
  return {
    chain(fn) {
      this.trail.push(fn);
      return this as any;
    },
    async run() {
      let result = await Result.async(() => this.trail[0]());

      for (let index = 1; index < this.trail.length; index++) {
        if (result.isError()) {
          break;
        }
        result = await Result.async(() => this.trail[index](result.unwrap()));
      }

      return result as any;
    },
    trail: [entryPoint],
  };
}

export const DataTrail = { createAsyncTrail, createSyncTrail };

export type AsyncDataTrail<T> = {
  trail: Array<Function>;
  chain<U>(fn: (previousValue: T) => Promise<U>): AsyncDataTrail<U>;
  run(): Promise<Result<T, Error>>;
};

export type SyncDataTrail<T> = {
  trail: Array<Function>;
  chain<U>(fn: (previousValue: T) => U): SyncDataTrail<U>;
  run(): Result<T, Error>;
};
