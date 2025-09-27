/** @typedef {import("prettier").Config} PrettierConfig */

/** @type { PrettierConfig } */
export const prettierConfig = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
  bracketSameLine: false,
  plugins: ["prettier-plugin-tailwindcss"],
};
