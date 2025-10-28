import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  noExternal: ["@saas/auth", "@saas/env"],
});
