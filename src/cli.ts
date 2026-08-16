#!/usr/bin/env node
import json2md from "json2md";

import { parseArgs } from "node:util";

import { readmeJSON } from "./documentation.ts";

function showHelp() {
  console.log(`Documentation CLI

Usage:
  $ node ./src/cli.ts --documentation

Options:
  --documentation  Render all sections, or a comma-separated list of sections
  --help           Show this help menu`);
}

function run() {
  const rawArgs = process.argv.slice(2);

  if (rawArgs.length === 0) {
    console.error("Error: No flags provided.\n");
    showHelp();
    process.exit(1);
  }

  const { values } = parseArgs({
    allowPositionals: false,
    args: process.argv.slice(2),
    options: {
      documentation: {
        type: "boolean",
      },
      help: {
        type: "boolean",
      },
    },
  });

  if (values.help) {
    showHelp();
    process.exit(0);
  }

  if (values.documentation) {
    console.log(json2md(readmeJSON as any));
  }

  if (!values.help && !values.documentation) {
    console.error("Error: Missing required flag --documentation\n");
    showHelp();
    process.exit(1);
  }
}

run();
