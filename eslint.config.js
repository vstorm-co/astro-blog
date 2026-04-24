import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";

/** @type {import("eslint").Linter.Config[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    rules: {
      // Ban <img> in Astro components — use <Image> or <Figure>.
      "no-restricted-syntax": [
        "warn",
        {
          selector: "JSXOpeningElement[name.name='img']",
          message: "Use <Image> from astro:assets or the <Figure> component instead of <img>.",
        },
      ],
    },
  },
  {
    ignores: ["dist/", "node_modules/", ".astro/"],
  },
];
