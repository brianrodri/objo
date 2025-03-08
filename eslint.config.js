import eslintJs from "@eslint/js";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";
import vitestEslintPlugin from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";
import eslintConfigPreact from "eslint-config-preact";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginBoundaries from "eslint-plugin-boundaries";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginJsdoc from "eslint-plugin-jsdoc";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginTsdoc from "eslint-plugin-tsdoc";
import globals from "globals";

import { ELEMENT_SETTINGS, ELEMENT_TYPE_RULES, EXTERNAL_RULES } from "./boundaries.config.js";

export default defineConfig([
    { ignores: [".husky/", "coverage/", "docs/", "dist/", "node_modules/"] },

    eslintJs.configs.recommended,
    ...eslintConfigPreact.flat,
    eslintPluginJsdoc.configs["flat/recommended-error"],

    {
        files: ["*.config.js", "src/**/*.{ts,tsx}"],
        ...eslintPluginImport.flatConfigs.recommended,
        rules: {
            "import/order": [
                "error",
                {
                    "alphabetize": { order: "asc", caseInsensitive: true },
                    "groups": [["builtin", "external", "unknown"], "internal", ["parent", "sibling", "index"]],
                    "named": { enabled: true, types: "types-first" },
                    "newlines-between": "always",
                },
            ],
            "import/no-named-as-default": "error",
            "import/no-named-as-default-member": "error",
            "import/no-duplicates": "error",
        },
        settings: {
            "import/core-modules": [
                "eslint-config-preact",
                "eslint-plugin-boundaries",
                "eslint-plugin-import",
                "obsidian",
            ],
            "import/resolver": { typescript: { alwaysTryTypes: true } },
        },
    },

    {
        files: ["src/**/*.{ts,tsx}"],
        ...eslintPluginJsdoc.configs["flat/recommended-typescript-error"],
        plugins: {
            "@typescript-eslint": typescriptEslintPlugin,
            "jsdoc": eslintPluginJsdoc,
            "react-hooks": eslintPluginReactHooks,
            "tsdoc": eslintPluginTsdoc,
        },
        rules: {
            ...typescriptEslintPlugin.configs.recommended.rules,
            ...typescriptEslintPlugin.configs.strict.rules,
            ...eslintPluginReactHooks.configs.recommended.rules,
            ...eslintPluginJsdoc.configs["flat/recommended-typescript-error"].rules,

            // https://tsdoc.org/pages/packages/eslint-plugin-tsdoc/
            "tsdoc/syntax": "error",
        },
        settings: {
            "import/core-modules": ["obsidian"],
        },
        languageOptions: {
            globals: { ...globals.browser },
            parser: typescriptEslintParser,
            parserOptions: { ecmaFeatures: { modules: true }, ecmaVersion: "latest" },
        },
    },

    {
        files: ["src/**/*.test.{ts,tsx}"],
        ...vitestEslintPlugin.configs.recommended,
        rules: {
            "vitest/expect-expect": ["off", { assertFunctionNames: ["expect", "expectTypeOf"] }],
        },
    },

    // Turns off all rules that are unnecessary or might conflict with Prettier.
    eslintConfigPrettier,

    {
        files: ["src/**/*"],
        plugins: { boundaries: eslintPluginBoundaries },
        settings: {
            "boundaries/include": ["src/**/*"],
            "boundaries/ignore": ["**/__tests__/**/*", "**/__mocks__/**/*"],
            "boundaries/elements": ELEMENT_SETTINGS,
        },
        rules: {
            ...eslintPluginBoundaries.configs.strict.rules,
            "boundaries/element-types": ["error", { default: "disallow", rules: ELEMENT_TYPE_RULES }],
            "boundaries/external": ["error", { default: "disallow", rules: EXTERNAL_RULES }],
        },
    },
]);
