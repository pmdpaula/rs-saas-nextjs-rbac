import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import globals from "globals";
import { config as baseConfig } from "./base.js";
import { prettierConfig } from './prettier.js';

/**
 * A custom ESLint configuration for libraries that use Node.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nodeJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  prettierConfig,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "simple-import-sort": tseslint.plugins["simple-import-sort"],
    },
    rules: {
      "simple-import-sort/imports": "error",
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
    },
  },
];
