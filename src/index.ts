import { createAsyncTrail, createSyncTrail } from "./dataTrail.ts";
import { async, sync } from "./result.ts";

export const Result = { async, sync };
export const DataTrail = { createAsyncTrail, createSyncTrail };
