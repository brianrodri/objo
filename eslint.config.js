import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptPluginParser from "@typescript-eslint/parser";
import globals from "globals";

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
    { ignores: ["coverage/", "docs/", "dist/", "node_modules/", "test-vault/"] },

    js.configs.recommended,

    {
        files: ["*.config.js", ".husky/install.js"],
        languageOptions: {
            globals: { ...globals.node },
        },
    },

    {
        files: ["src/**/*.{ts,tsx}"],
        plugins: {
            "@typescript-eslint": typescriptPlugin,
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            ...typescriptPlugin.configs.recommended.rules,
            ...typescriptPlugin.configs.strict.rules,
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
        languageOptions: {
            globals: { ...globals.browser },
            parser: typescriptPluginParser,
            parserOptions: {
                ecmaFeatures: { modules: true },
                ecmaVersion: "latest",
            },
        },
    },

    {
        plugins: { prettier: prettierPlugin },
        rules: {
            ...prettierConfig.rules,
            "prettier/prettier": "error",
        },
    },
];
