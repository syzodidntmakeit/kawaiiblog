import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: ["dist/", "node_modules/", ".astro/"],
  },
];
