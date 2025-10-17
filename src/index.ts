import { createAsyncTrail, createSyncTrail } from "./lib/dataTrail.ts";
import { async, sync } from "./lib/result.ts";

export const Result = { async, sync };
export const DataTrail = { createAsyncTrail, createSyncTrail };
