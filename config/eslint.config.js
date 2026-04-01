import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["build", "dist", "node_modules", ".cache"],
  },
  {
    ...js.configs.recommended,
    files: ["config/**/*.js", "scripts/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: globals.node,
    },
  },
  {
    files: ["src/**/*.ts"],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.browser,
        beforeEach: "readonly",
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    ...js.configs.recommended,
    files: ["src/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: globals.browser,
    },
  },
  {
    files: ["config/**/*.ts"],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.node,
    },
  },
);
