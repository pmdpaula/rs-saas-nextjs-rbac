/** @typedef {import("prettier").Config} PrettierConfig */

/** @type { PrettierConfig } */
const prettierConfig = {
  printWidth: 100,
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

export default prettierConfig;
