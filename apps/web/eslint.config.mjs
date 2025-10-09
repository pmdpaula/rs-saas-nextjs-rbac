import { nextJsConfig } from '@saas/eslint-config/next';

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  // Other configurations
  {
    ignores: ["dist/**", "src/generated/**"],
  },
];
