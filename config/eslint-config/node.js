import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import pluginReactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import { config as baseConfig } from "./base.js";
// import globals from "globals";
// import { prettierConfig } from "./prettier.js";

/**
 * A custom ESLint configuration for libraries that use Node.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nodeJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  // prettierConfig,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "no-html-link-for-pages": "off",
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
