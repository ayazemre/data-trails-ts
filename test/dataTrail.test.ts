import { describe, test } from "node:test";
import { Result, DataTrail } from "#src/index.ts";
import { equal, throws } from "assert";

describe("Result", () => {
	function testFunctionNumber() {
		return 12345;
	}
	function testFunctionString() {
		return "qwertyuioip";
	}
	function testFunctionNull() {
		return null;
	}
	function testFunctionThrow() {
		throw new Error("Test Error");
	}
	function testFunctionObject(propA: number, propB: string) {
		return {
			propertyA: propA,
			propertyB: propB,
		};
	}

	test("Async Data Trail Success", async () => {
		const trail = DataTrail.createAsyncTrail(async () => testFunctionString());
		const trailResult = await trail.run();
		equal(trailResult.unwrap(), "qwertyuioip");
		const trail2 = trail.chain(async (previousValue) => testFunctionNull());
		const trailResult2 = await trail2.run();
		equal(trailResult2.unwrap(), null);
		const trail3 = trail2.chain(async (previousValue) => testFunctionNumber());
		const trailResult3 = await trail3.run();
		equal(trailResult3.unwrap(), 12345);
		const trail4 = trail3.chain(async (previousValue) => testFunctionObject(previousValue, previousValue + ""));
		const trailResult4 = await trail4.run();
		equal(trailResult4.unwrap().propertyA, 12345);
		equal(trailResult4.unwrap().propertyB, "12345");
		const trail5 = trail4.chain(async (previousValue) => testFunctionObject(previousValue.propertyA + 1, previousValue.propertyB + "asdfs"));
		const trailResult5 = await trail4.run();
		equal(trailResult5.unwrap().propertyA, 12346);
		equal(trailResult5.unwrap().propertyB, "12345asdfs");
	});
});
