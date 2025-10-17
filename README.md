# Data Trails

[![npm version](https://badge.fury.io/js/data-trails.svg)](https://badge.fury.io/js/data-trails)
[![Build Status](https://travis-ci.org/ayazemre/data-trails-ts.svg?branch=dev)](https://travis-ci.org/ayazemre/data-trails-ts)

Data Trails is a lightweight TypeScript library that provides a robust and elegant way to handle operations that might fail, such as network requests, file system operations, or any function that can throw an error. It's built around two core concepts: `Result` and `DataTrail`.

- **`Result`**: A wrapper for functions that might fail. It prevents exceptions from being thrown, catches them, and forces you to handle errors explicitly at the point of failure.
- **`DataTrail`**: A utility for chaining multiple fallible operations together in a clean, readable, and safe way, inspired by railway-oriented programming.

This approach helps you write more predictable and maintainable code by making error handling a first-class citizen.

## Installation

```bash
npm install data-trails
# or
yarn add data-trails
```

## Core Concept: `Result`

The `Result<T, Error>` type is a wrapper that represents one of two outcomes:

- `T`: The operation succeeded, containing a value of type `T`.
- `Error`: The operation failed, containing an error.

This pattern prevents your application from crashing due to unhandled exceptions and makes error flow explicit.

### `Result.sync`

Use `Result.sync` to wrap synchronous functions that might throw an error.

Let's say you have a function that parses JSON and can throw an error:

```typescript
const parseJSON = (jsonString: string): { message: string } => {
	if (!jsonString) {
		throw new Error("Input string cannot be empty!");
	}
	return JSON.parse(jsonString);
};
```

Instead of a `try...catch` block, you can wrap it with `Result.sync`:

```typescript
import { Result } from "data-trails";

// --- Success Case ---
const successResult = Result.sync(() => parseJSON('{ "message": "Hello World" }'));

if (!successResult.isError()) {
	// Safely access the value
	console.log(successResult.unwrap().message); // "Hello World"
}

// --- Failure Case ---
const errorResult = Result.sync(() => parseJSON("invalid-json"));

if (errorResult.isError()) {
	// Handle the error explicitly
	console.error(errorResult.unwrapError().message); // "Unexpected token i in JSON at position 0"
}
```

The `Result` object exposes `isError()`, `unwrap()` and `unwrapError()` rather than `isOk`/`isErr` or direct `value`/`error` properties.

### `Result.async`

Use `Result.async` to wrap asynchronous functions or `Promise`s. It works similarly but returns a `Promise<Result<T, E>>`.

Consider a function that fetches data from an API:

```typescript
const fetchUserData = async (userId: string): Promise<{ id: string; name: string }> => {
	const response = await fetch(`https://api.example.com/users/${userId}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch user: ${response.statusText}`);
	}
	return response.json();
};
```

Wrapping it with `Result.async`:

```typescript
import { Result } from "data-trails";

async function getUser(id: string) {
	const userResult = await Result.async(fetchUserData(id));

	if (!userResult.isError()) {
		console.log(`Welcome, ${userResult.unwrap().name}!`);
	} else {
		console.error(`Error fetching user: ${userResult.unwrapError().message}`);
	}
}
```

## Core Concept: `DataTrail`

The `DataTrail` utility allows you to chain multiple operations. If any step fails, the trail short-circuits and returns the first error; subsequent steps are not executed.

Important: the actual API uses factory functions to create trails and method names differ from some drafts. Use `DataTrail.createSyncTrail(...)` or `DataTrail.createAsyncTrail(...)`, then chain with `.chain(...)` and execute with `.run()`.

### `DataTrail` Usage

Imagine a workflow where you need to:

1.  Fetch a user from an API.
2.  Validate the user's email address.
3.  Send a welcome email.

Each of these steps can fail. Using `DataTrail`, you can write this cleanly:

```typescript
import { Result, DataTrail } from "data-trails";

// Assume these functions are defined elsewhere and return Result or Promise<Result>
declare function fetchUser(userId: string): Promise<Result<{ email: string }, Error>>;
declare function validateEmail(user: { email: string }): Result<{ email: string }, Error>;
declare function sendWelcomeEmail(user: { email: string }): Promise<Result<boolean, Error>>;

async function onboardUser(userId: string) {
	// create an async trail that starts from the userId
	const trail = DataTrail.createAsyncTrail(async () => userId);

	// chain steps; each step can return Result or Promise<Result>
	const finalResult = await trail
		.chain(async (id) => fetchUser(id)) // returns Promise<Result<..., Error>>
		.chain((res) => {
			// if the previous step produced an error Result, short-circuit behavior is handled by the trail
			return validateEmail(res.unwrap());
		})
		.chain((validated) => sendWelcomeEmail(validated))
		.run();

	if (!finalResult.isError()) {
		console.log("User onboarding successful!");
	} else {
		console.error("Onboarding failed:", finalResult.unwrapError().message);
	}
}
```

In the example above, if `fetchUser` or `validateEmail` fails, `sendWelcomeEmail` will not be called. The `DataTrail` short-circuits and `finalResult` will contain the error from the first failed step.

## API

### `Result<T, E>`

- `Result.sync(fn: () => T): Result<T, Error>` — wrap a sync function that may throw.
- `Result.async(p: Promise<T> | (() => Promise<T>)): Promise<Result<T, Error>>` — wrap an async value.
- Result instance methods:
  - `isError(): boolean`
  - `unwrap(): T` — returns value or throws if error
  - `unwrapError(): Error` — returns error or throws if success
  - `mapError(fn: (e: Error) => Error): Result<T, Error>`

### `DataTrail`

- `DataTrail.createSyncTrail(entryPoint: () => T)` — create a synchronous trail.
- `DataTrail.createAsyncTrail(entryPoint: () => Promise<T> | PromiseLike<T>)` — create an asynchronous trail.
- Trail instance methods:
  - `.chain(fn)` — append a step; receives previous step's value. Sync trails expect sync functions; async trails accept async functions.
  - `.run()` — execute the trail. Sync trails return a `Result`; async trails return `Promise<Result<...>>`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue. Tests in `test/` show expected behavior.

## License

MIT
