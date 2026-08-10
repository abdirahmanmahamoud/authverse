import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  format: ["cjs", "esm"],
  dts: false,
  outDir: "dist",
  platform: "node",
  tsconfig: "tsconfig.build.json",
});
