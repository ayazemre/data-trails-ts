export const readmeJSON = [
  { h1: "Data Trails" },
  {
    link: {
      source: "https://badge.fury.io/js/data-trails",
      title: "![npm version](https://badge.fury.io/js/data-trails.svg)",
    },
  },
  {
    p: "Data Trails is a lightweight TypeScript library that provides a robust and elegant way to handle operations that might fail, such as network requests, file system operations, or any function that can throw an error. It's built around two core concepts: `Result` and `DataTrail`.",
  },
  {
    ul: [
      "**`Result`**: A wrapper for functions that might fail. It prevents exceptions from being thrown, catches them, and forces you to handle errors explicitly at the point of failure.",
      "**`DataTrail`**: A utility for chaining multiple fallible operations together in a clean, readable, and safe way, inspired by railway-oriented programming.",
    ],
  },
  {
    p: "This approach helps you write more predictable and maintainable code by making error handling a first-class citizen.",
  },
  { h2: "Installation" },
  {
    code: {
      content: "npm install data-trails",
      language: "bash",
    },
  },

  { h2: "Core Concept: `Result`" },
  {
    p: "The `Result<T, Error>` type is a wrapper that represents one of two outcomes:",
  },
  {
    ul: ["`T`: The operation succeeded, containing a value of type `T`.", "`Error`: The operation failed, containing an error."],
  },
  {
    p: "This pattern prevents your application from crashing due to unhandled exceptions and makes error flow explicit.",
  },
  { h3: "`Result.wrap`" },
  {
    p: "Automatically wraps any value into a `Result`. If the value is an `Error` instance, it creates an error result. Otherwise, it creates a success result. This is useful for wrapping existing variables or return values.",
  },
  {
    code: {
      content: [
        'import { Result } from "data-trails";',
        "",
        'const success = Result.wrap("Hello"); // Result<string, Error>',
        'const failure = Result.wrap(new Error("Fail")); // Result<never, Error>',
      ],
      language: "typescript",
    },
  },
  { h3: "`Result.sync`" },
  {
    p: "Use `Result.sync` to wrap synchronous functions that might throw an error.",
  },
  {
    p: "Let's say you have a function that parses JSON and can throw an error:",
  },
  {
    code: {
      content: [
        "function parseJSON(jsonString: string): { message: string } {",
        "  if (!jsonString) {",
        '    throw new Error("Input string cannot be empty!");',
        "  }",
        "  return JSON.parse(jsonString);",
        "}",
      ],
      language: "typescript",
    },
  },
  {
    p: "Instead of a `try...catch` block, you can wrap it with `Result.sync`:",
  },
  {
    code: {
      content: [
        'import { Result } from "data-trails";',
        "",
        "// --- Success Case ---",
        'const successResult = Result.sync(() => parseJSON(\'{ "message": "Hello World" }\'));',
        "",
        "if (!successResult.isError()) {",
        "  // Safely access the value",
        '  console.log(successResult.unwrap().message); // "Hello World"',
        "}",
        "",
        "// --- Failure Case ---",
        'const errorResult = Result.sync(() => parseJSON("invalid-json"));',
        "",
        "if (errorResult.isError()) {",
        "  // Handle the error explicitly",
        '  console.error(errorResult.unwrapError().message); // "Unexpected token i in JSON at position 0"',
        "}",
      ],
      language: "typescript",
    },
  },
  {
    p: "The `Result` object exposes `isError()`, `unwrap()` and `unwrapError()` rather than `isOk`/`isErr` or direct `value`/`error` properties.",
  },
  { h3: "`Result.async`" },
  {
    p: "Use `Result.async` to wrap asynchronous functions. It takes a factory function that returns a `Promise` and returns a `Promise<Result<T, Error>>`.",
  },
  {
    p: "Consider a function that fetches data from an API:",
  },
  {
    code: {
      content: [
        "async function fetchUserData(userId: string): Promise<{ id: string; name: string }> {",
        "  const response = await fetch(`https://api.example.com/users/${userId}`);",
        "  if (!response.ok) {",
        "    throw new Error(`Failed to fetch user: ${response.statusText}`);",
        "  }",
        "  return response.json();",
        "}",
      ],
      language: "typescript",
    },
  },
  {
    p: "Wrapping it with `Result.async`:",
  },
  {
    code: {
      content: [
        'import { Result } from "data-trails";',
        "",
        "async function getUser(id: string) {",
        "  // Note: We pass a factory function () => fetchUserData(id)",
        "  const userResult = await Result.async(() => fetchUserData(id));",
        "",
        "  if (!userResult.isError()) {",
        "    console.log(`Welcome, ${userResult.unwrap().name}!`);",
        "  } else {",
        "    console.error(`Error fetching user: ${userResult.unwrapError().message}`);",
        "  }",
        "}",
      ],
      language: "typescript",
    },
  },

  { h2: "Core Concept: `DataTrail`" },
  {
    p: "The `DataTrail` utility allows you to chain multiple operations. If any step fails (either by returning an error Result or throwing an exception), the trail short-circuits and returns the first error; subsequent steps are not executed.",
  },
  { h3: "`DataTrail` Usage" },
  {
    p: "Imagine a workflow where you need to:",
  },
  {
    ol: ["Fetch a user from an API.", "Validate the user's data.", "Save the user to a database."],
  },
  {
    p: 'Using `DataTrail`, you can write this as a clean "Happy Path" chain:',
  },
  {
    code: {
      content: [
        'import { Result, DataTrail } from "data-trails";',
        "",
        "// Assume these functions can throw or return raw values",
        "declare function fetchUser(userId: string): Promise<{ email: string }>;",
        "declare function validateUser(user: { email: string }): { email: string; valid: boolean };",
        "declare function saveUser(user: { email: string }): Promise<boolean>;",
        "",
        "async function onboardUser(userId: string) {",
        "  const finalResult = await DataTrail.createAsyncTrail(() => fetchUser(userId))",
        "    .chain(async (user) => validateUser(user))",
        "    .chain(async (validated) => saveUser(validated))",
        "    .run();",
        "",
        "  if (!finalResult.isError()) {",
        '    console.log("User onboarding successful!");',
        "  } else {",
        "    // If any step failed, the error is captured here",
        '    console.error("Onboarding failed:", finalResult.unwrapError().message);',
        "  }",
        "}",
      ],
      language: "typescript",
    },
  },

  { h2: "API" },
  { h3: "`Result<T, E = Error>`" },
  {
    ul: [
      "`Result.wrap(value: T): Result` — Wraps the given value with a result. If the given value is an instance of `Error`, it returns an error result (`Result<never, Error>`). Otherwise, it returns a success result (`Result<T, never>`).",
      "`Result.sync(fn: () => T): Result<T, Error>` — wrap a sync function.",
      "`Result.async(fn: () => Promise<T>): Promise<Result<T, Error>>` — wrap an async function.",
      "`Result.void(): Result<void, Error>` — create a successful result with no value.",
      "Result instance methods:",
      {
        ul: [
          "`isError(): this is Result<never, E>` — returns true if the result is an error. Acts as a type guard.",
          "`unwrap(): T` — returns value or throws if error.",
          "`unwrapError(): E` — returns error or throws if success.",
          "`mapError(fn: (e: E) => E): Result<T, E>` — transforms the error. Throws if called on a success result.",
        ],
      },
    ],
  },
  { h3: "`DataTrail`" },
  {
    ul: [
      "`DataTrail.createSyncTrail(entryPoint: () => T)` — create a synchronous trail.",
      "`DataTrail.createAsyncTrail(entryPoint: () => Promise<T>)` — create an asynchronous trail.",
      "Trail instance methods:",
      {
        ul: [
          "`.chain(fn)` — append a step; receives previous step's unwrapped value.",
          "`.run()` — execute the trail. Returns a `Result` or `Promise<Result>`.",
        ],
      },
    ],
  },
  { h2: "Contributing" },
  {
    p: "Contributions are welcome! Please feel free to submit a pull request or open an issue.",
  },
  { h2: "License" },
  {
    p: "MIT",
  },
];
