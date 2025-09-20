import { describe, test } from "node:test";
import { Result } from "#src/index.ts";
import { equal, throws } from "assert";

describe("Result", () => {
	const testFunctionSync = (params: { throws?: boolean; returns?: string | null | undefined }) => {
		if (params.throws) throw new Error("Test Error");
		if (params.returns) return params.returns;
		return null;
	};

	const testFunctionAsync = async (params: { throws?: boolean; returns?: string | null | undefined }) => {
		if (params.throws) throw new Error("Test Error");
		if (params.returns) return params.returns;
		return null;
	};

	test("Sync Success", async () => {
		const result = Result.sync(() => testFunctionSync({ returns: "Data" }));

		equal(result.unwrap(), "Data");
		throws(() => result.unwrapError());
		equal(result.isError(), false);
	});

	test("Sync Void Success", async () => {
		const result = Result.sync(() => {});

		equal(result.unwrap(), null);
		throws(() => result.unwrapError());
		equal(result.isError(), false);
	});

	test("Sync Throw Capture", async () => {
		const result = Result.sync(() => testFunctionSync({ throws: true }));

		throws(() => result.unwrap());
		equal(result.unwrapError().message, "Test Error");
		equal(result.isError(), true);
	});

	test("Sync Null Capture", async () => {
		const result = Result.sync(() => testFunctionSync({ returns: null }));

		equal(result.unwrap(), null);
		throws(() => result.unwrapError());
		equal(result.isError(), false);
	});

	test("Sync Undefined Capture", async () => {
		const result = Result.sync(() => testFunctionSync({ returns: undefined }));

		equal(result.unwrap(), undefined);
		throws(() => result.unwrapError());
		equal(result.isError(), false);
	});

	// Async Test

	test("Async Success", async () => {
		const result = await Result.async(testFunctionAsync({ returns: "Data" }));

		equal(result.unwrap(), "Data");
		throws(() => result.unwrapError());
		equal(result.isError(), false);
	});

	test("Async Throw Capture", async () => {
		const result = await Result.async(testFunctionAsync({ throws: true }));

		throws(() => result.unwrap());
		equal(result.unwrapError().message, "Test Error");
		equal(result.isError(), true);
	});

	test("Async Null Capture", async () => {
		const result = await Result.async(testFunctionAsync({ returns: "" }));

		equal(result.unwrap(), null);
		equal(result.isError(), false);
	});
	test("Async Undefined Capture", async () => {
		const result = await Result.async(testFunctionAsync({ returns: undefined }));

		equal(result.unwrap(), undefined);
		equal(result.isError(), false);
	});
});
