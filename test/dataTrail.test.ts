import { DataTrail } from "#src/dataTrail.ts";

import { equal } from "assert";
import { describe, test } from "node:test";

describe("Data Trail", () => {
  test("Sync Success", async () => {
    const trail = DataTrail.createSyncTrail(() => testSyncString("testString"));
    const trailResult = trail.run();
    equal(trailResult.unwrap(), "testString");

    const trail2 = trail.chain((previousValue) => testSyncObject({ propertyA: 12345, propertyB: previousValue }));
    const trailResult2 = trail2.run();
    equal(trailResult2.unwrap().propertyA, 12345);
    equal(trailResult2.unwrap().propertyB, "testString");
  });

  test("Sync Error", async () => {
    const trail = DataTrail.createSyncTrail(() => testSyncString("testString"));
    const trailResult = trail.run();
    equal(trailResult.unwrap(), "testString");

    const trail2 = trail.chain((previousValue) => testSyncThrows(previousValue));
    const trailResult2 = trail2.run();
    equal(trailResult2.isError(), true);
    equal(trailResult2.unwrapError().message, "testString");
  });

  test("Sync Early Return", async () => {
    const trail = DataTrail.createSyncTrail(() => testSyncString("testString"));
    const trailResult = trail.run();
    equal(trailResult.unwrap(), "testString");

    const trail2 = trail.chain((previousValue) => testSyncThrows(previousValue));
    const trailResult2 = trail2.run();
    equal(trailResult2.isError(), true);
    equal(trailResult2.unwrapError().message, "testString");

    const trail3 = trail2.chain((previousValue) => testSyncObject({ propertyA: 12345, propertyB: previousValue }));
    const trailResult3 = trail3.run();
    equal(trailResult3.isError(), true);
    equal(trailResult3.unwrapError().message, "testString");
  });

  test("Async Success", async () => {
    const trail = DataTrail.createAsyncTrail(() => testAsyncString("testString"));
    const trailResult = await trail.run();
    equal(trailResult.unwrap(), "testString");

    const trail2 = trail.chain((previousValue) => testAsyncObject({ propertyA: 12345, propertyB: previousValue }));
    const trailResult2 = await trail2.run();
    equal(trailResult2.unwrap().propertyA, 12345);
    equal(trailResult2.unwrap().propertyB, "testString");
  });

  test("Async Error", async () => {
    const trail = DataTrail.createAsyncTrail(() => testAsyncString("testString"));
    const trailResult = await trail.run();
    equal(trailResult.unwrap(), "testString");

    const trail2 = trail.chain((previousValue) => testAsyncThrows(previousValue));
    const trailResult2 = await trail2.run();
    equal(trailResult2.isError(), true);
    equal(trailResult2.unwrapError().message, "testString");
  });

  test("Async Early Return", async () => {
    const trail = DataTrail.createAsyncTrail(() => testAsyncString("testString"));
    const trailResult = await trail.run();
    equal(trailResult.unwrap(), "testString");

    const trail2 = trail.chain((previousValue) => testAsyncThrows(previousValue));
    const trailResult2 = await trail2.run();
    equal(trailResult2.isError(), true);
    equal(trailResult2.unwrapError().message, "testString");

    const trail3 = trail2.chain((previousValue) => testAsyncObject({ propertyA: 12345, propertyB: previousValue }));
    const trailResult3 = await trail3.run();
    equal(trailResult3.isError(), true);
    equal(trailResult3.unwrapError().message, "testString");
  });
});

async function testAsyncString(text: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return text;
}

async function testAsyncObject<T extends object>(object: T) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return object;
}

async function testAsyncThrows(message: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  throw new Error(message);
}

function testSyncString(text: string) {
  return text;
}

function testSyncObject<T extends object>(object: T) {
  return object;
}

function testSyncThrows(message: string) {
  throw new Error(message);
}
