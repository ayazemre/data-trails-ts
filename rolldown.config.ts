import { defineConfig } from "rolldown";
import { glob } from "tinyglobby";

export default defineConfig({
  external: [/node_modules/],
  input: await glob("src/**/*.ts"),
  output: {
    cleanDir: true,
    preserveModules: true,
    preserveModulesRoot: "src",
    sourcemap: true,
  },
  platform: "node",
  resolve: {
    extensions: [".ts"],
  },
});
