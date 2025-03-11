import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";
import boundaries from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import tsdoc from "eslint-plugin-tsdoc";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

import { ELEMENT_SETTINGS, ELEMENT_TYPE_RULES, EXTERNAL_RULES } from "./boundaries.config.js";

export default defineConfig([
    { ignores: [".husky/", "coverage/", "docs/", "dist/", "node_modules/"] },

    { plugins: { js }, extends: ["js/recommended"] },
    { plugins: { jsdoc }, files: ["**/*.{js,jsx}"], extends: ["jsdoc/flat/recommended-error"] },
    {
        plugins: { jsdoc },
        files: ["**/*.{ts,tsx}"],
        extends: ["jsdoc/flat/recommended-typescript-error"],
        settings: {
            // Define the core TSDoc tag [`@typeParam`](https://tsdoc.org/pages/tags/typeparam/)
            // See: https://github.com/gajus/eslint-plugin-jsdoc/issues/844#issuecomment-1051308663
            jsdoc: { structuredTags: { typeParam: { name: "namepath-referencing", type: false, required: ["name"] } } },
        },
    },
    { plugins: { tsdoc }, files: ["**/*.{ts,tsx}"], rules: { "tsdoc/syntax": "error" } },

    {
        extends: [typescriptEslint.configs.recommendedTypeChecked],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: typescriptEslint.parser,
            parserOptions: { ecmaVersion: "latest", projectService: true, tsconfigRootDir: import.meta.dirname },
        },
    },

    {
        extends: [eslintPluginReactHooks.configs["recommended-latest"]],
        files: ["**/*.{ts,tsx}"],
    },

    {
        extends: [importPlugin.flatConfigs.recommended],
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
            "import/core-modules": ["obsidian"],
            "import/resolver": { typescript: { alwaysTryTypes: true } },
        },
    },

    {
        files: ["*.config.js"],
        languageOptions: { globals: { ...globals.node }, ecmaVersion: "latest", sourceType: "module" },
    },

    {
        plugins: { vitest },
        extends: ["vitest/recommended"],
        files: ["**/*.test.{ts,tsx}"],
        rules: { "vitest/expect-expect": ["error", { assertFunctionNames: ["expect", "expectTypeOf"] }] },
    },

    {
        plugins: { boundaries },
        extends: ["boundaries/strict"],
        settings: {
            "boundaries/include": ["**/*"],
            "boundaries/ignore": ["**/__tests__/**/*", "**/__mocks__/**/*"],
            "boundaries/elements": ELEMENT_SETTINGS,
        },
        rules: {
            "boundaries/element-types": ["error", { default: "disallow", rules: ELEMENT_TYPE_RULES }],
            "boundaries/external": ["error", { default: "disallow", rules: EXTERNAL_RULES }],
        },
    },
]);
