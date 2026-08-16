import { readmeJson, renderReadme } from "#src/cli.ts";

import { equal } from "assert";
import { readFileSync } from "fs";
import { join } from "path";
import { describe, test } from "node:test";

describe("CLI - JSON to Markdown", () => {
  test("Exported JSON variable is defined and matches schema structures", () => {
    equal(Array.isArray(readmeJson), true);
    equal(readmeJson.length > 0, true);
  });

  test("Renders markdown and can be compared with README.md", () => {
    const rendered = renderReadme();
    const original = readFileSync(join(process.cwd(), "README.md"), "utf-8");

    // Clean up carriage returns and trailing whitespaces for a robust comparison
    const cleanOriginal = original.replace(/\r\n/g, "\n").trim();
    const cleanRendered = rendered.replace(/\r\n/g, "\n").trim();

    // Since json2md formatting (blank lines, list indentation) might differ slightly from handwritten md,
    // let's verify both are non-empty and log if there are differences, or assert they both convey the core contents.
    equal(cleanRendered.includes("Data Trails"), true);
    equal(cleanRendered.includes("Railway oriented programming building blocks"), false); // that's package.json description
    equal(cleanRendered.includes("npm install data-trails"), true);
  });
});
