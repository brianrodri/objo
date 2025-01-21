import boundaries from "eslint-plugin-boundaries";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import preactPlugin from "eslint-config-preact";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptPluginParser from "@typescript-eslint/parser";

/** @type { import("eslint").Linter.Config[] } */
export default [
    { ignores: [".husky/", "coverage/", "docs/", "dist/", "node_modules/", "test-vault/"] },

    ...preactPlugin,

    {
        files: ["*.config.js"],
        rules: { "sort-imports": ["error"] },
        languageOptions: { globals: { ...globals.node } },
    },

    {
        files: ["src/**/*.{ts,tsx}"],
        plugins: {
            "@typescript-eslint": typescriptPlugin,
            "react-hooks": reactHooksPlugin,
        },
        rules: {
            ...typescriptPlugin.configs.recommended.rules,
            ...typescriptPlugin.configs.strict.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            "sort-imports": ["error"],
            // TypeScript already checks for duplicates: https://archive.eslint.org/docs/rules/no-dupe-class-members
            "no-dupe-class-members": "off",
        },
        languageOptions: {
            globals: { ...globals.browser },
            parser: typescriptPluginParser,
            parserOptions: { ecmaFeatures: { modules: true }, ecmaVersion: "latest" },
        },
    },

    eslintConfigPrettier,

    {
        files: ["src/**/*"],
        plugins: { boundaries },
        settings: {
            "boundaries/include": ["src/**/*"],
            "boundaries/ignore": ["**/__tests__/**/*", "**/__mocks__/**/*"],
            "boundaries/elements": [
                { type: "main", pattern: ["src/main.tsx"], mode: "full" },
                { type: "shared", pattern: ["src/components", "src/context", "src/data", "src/utils"], mode: "folder" },
                { type: "lib", pattern: ["src/lib/*/**/*"], capture: ["libName"], mode: "full" },
                { type: "features", pattern: ["src/features/*/**/*"], capture: ["featureName"], mode: "full" },
                { type: "layout", pattern: ["src/layout/*/**/*"], capture: ["layoutName"], mode: "full" },
            ],
            "import/resolver": {
                typescript: { alwaysTryTypes: true },
            },
        },
        rules: {
            ...boundaries.configs.recommended.rules,
            ...boundaries.configs.strict.rules,
            "boundaries/no-unknown": ["error"],
            "boundaries/no-unknown-files": ["error"],
            "boundaries/element-types": [
                "error",
                {
                    default: "disallow",
                    rules: [
                        {
                            from: ["lib", "shared"],
                            allow: ["lib", "shared"],
                        },
                        {
                            from: ["features"],
                            allow: ["lib", "shared", ["features", { featureName: "${from.featureName}" }]],
                        },
                        {
                            from: ["layout"],
                            allow: ["features", "shared", ["layout", { layoutName: "${from.layoutName}" }]],
                        },
                        {
                            from: ["main"],
                            allow: ["layout", "shared", "lib"],
                        },
                    ],
                },
            ],
            "boundaries/external": [
                "error",
                {
                    default: "disallow",
                    rules: [
                        { from: ["*"], allow: ["lodash", "luxon", "utility-types"] },
                        { from: [["lib", { libName: "obsidian" }]], allow: ["obsidian"] },
                        { from: [["lib", { libName: "obsidian-dataview" }]], allow: ["obsidian-dataview"] },
                        { from: ["shared", "layout"], allow: ["preact", "@preact/signals"] },
                    ],
                },
            ],
        },
    },
];
