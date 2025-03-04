import eslintConfigPreact from "eslint-config-preact";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginBoundaries from "eslint-plugin-boundaries";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import typescriptEslintParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import eslintPluginTsdoc from "eslint-plugin-tsdoc";
import { ELEMENTS, ELEMENT_TYPE_RULES, EXTERNAL_RULES } from "./boundaries.config.js";

/** @type { import("eslint").Linter.Config[] } */
export default [
    { ignores: [".husky/", "coverage/", "docs/", "dist/", "node_modules/"] },

    eslintPluginImport.flatConfigs.recommended,
    ...eslintConfigPreact.flat,

    {
        files: ["*.config.js"],
        rules: { "import/no-named-as-default": "off", "import/no-unresolved": "off" },
        languageOptions: { globals: { ...globals.node } },
    },

    {
        files: ["src/**/*.{ts,tsx}"],
        plugins: {
            "tsdoc": eslintPluginTsdoc,
            "@typescript-eslint": typescriptEslintPlugin,
            "react-hooks": eslintPluginReactHooks,
        },
        rules: {
            ...typescriptEslintPlugin.configs.recommended.rules,
            ...typescriptEslintPlugin.configs.strict.rules,
            ...eslintPluginReactHooks.configs.recommended.rules,

            "tsdoc/syntax": "error",

            // TypeScript already checks for duplicates: https://archive.eslint.org/docs/rules/no-dupe-class-members
            "no-dupe-class-members": "off",

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
        languageOptions: {
            globals: { ...globals.browser },
            parser: typescriptEslintParser,
            parserOptions: { ecmaFeatures: { modules: true }, ecmaVersion: "latest" },
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
            "boundaries/elements": ELEMENTS,
            "import/resolver": { typescript: { alwaysTryTypes: true } },
        },
        rules: {
            ...eslintPluginBoundaries.configs.strict.rules,
            "boundaries/element-types": ["error", { default: "disallow", rules: ELEMENT_TYPE_RULES }],
            "boundaries/external": ["error", { default: "disallow", rules: EXTERNAL_RULES }],
        },
    },
];
