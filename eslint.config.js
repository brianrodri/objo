import eslintConfigPreact from "eslint-config-preact";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginBoundaries from "eslint-plugin-boundaries";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import typescriptEslintParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import eslintPluginTsdoc from "eslint-plugin-tsdoc";

/** @type { import("eslint").Linter.Config[] } */
export default [
    { ignores: [".husky/", "coverage/", "docs/", "dist/", "node_modules/", "test-vault/"] },

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
            "boundaries/elements": [
                getBoundaryScopeDefinition("model"),
                { type: "main", pattern: ["src/main.tsx"], mode: "full" },
                { type: "shared", pattern: ["src/util"], mode: "folder" },
                { type: "lib", pattern: ["src/lib/*/**/*"], capture: ["libName"], mode: "full" },
                {
                    type: "lib:scope",
                    pattern: ["src/*/*/lib/*.*", "src/*/*/lib/*/**/*"],
                    capture: ["scope", "elementName", "libName"],
                    mode: "full",
                },
            ],
            "import/resolver": { typescript: { alwaysTryTypes: true } },
        },
        rules: {
            ...eslintPluginBoundaries.configs.strict.rules,
            "boundaries/element-types": [
                "error",
                {
                    default: "disallow",
                    rules: [
                        getBoundaryScopeRules("model"),
                        { from: "*", allow: "shared" },
                        { from: "lib", allow: [["lib", { libName: "${from.libName}" }]] },
                        {
                            from: ["lib:scope"],
                            allow: [
                                ["lib", { libName: "${from.libName}" }],
                                ["${from.scope}", { elementName: "${from.elementName}" }],
                            ],
                        },
                        { from: "main", allow: ["model", ["lib", { libName: "obsidian" }]] },
                    ],
                },
            ],
            "boundaries/external": [
                "error",
                {
                    default: "disallow",
                    rules: [
                        { from: ["lib"], allow: ["${from.libName}"] },
                        { from: ["*"], allow: ["assert", "lodash", "luxon", "path", "utility-types"] },
                    ],
                },
            ],
        },
    },
];

function getBoundaryScopeDefinition(scopeName) {
    return {
        type: scopeName,
        pattern: [`src/(${scopeName})/*`],
        capture: ["scope", "elementName"],
        mode: "folder",
    };
}

function getBoundaryScopeRules(scopeName, ...otherAllowed) {
    return {
        from: scopeName,
        allow: [
            [scopeName, { elementName: "${from.elementName}" }],
            ["lib:scope", { scope: scopeName, elementName: "${from.elementName}" }],
            ...otherAllowed,
        ],
    };
}
