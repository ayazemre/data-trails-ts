import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["dist", "node_modules"],
  overrides: [
    {
      files: ["*.config.ts"],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
  plugins: ["eslint", "import", "unicorn", "typescript"],
  rules: {
    "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "separate-type-imports", prefer: "type-imports" }],
    "@typescript-eslint/no-import-type-side-effects": "error",
    "import/no-default-export": "error",
    "import/no-named-as-default": "error",
    "max-statements": ["error", 50],
    "no-unused-vars": "error",
    "sort-keys": "error",
    "unicorn/filename-case": ["error", { cases: { camelCase: true } }],
  },
});
