import { FlatCompat } from "@eslint/eslintrc";
import eslintJs from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptPluginParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type { import("eslint").Linter.Config[] } */
export default [
    { ignores: ["coverage/", "docs/", "dist/", "node_modules/", "test-vault/"] },

    // TODO: Replace with ESLint v9 config: preactjs/eslint-config-preact#28
    ...new FlatCompat({
        baseDirectory: __dirname,
        resolvePluginsRelativeTo: __dirname,
        recommendedConfig: eslintJs.configs.recommended,
        allConfig: eslintJs.configs.all,
    }).extends("preact"),

    {
        files: ["*.config.js"],
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
        },
        languageOptions: {
            globals: { ...globals.browser },
            parser: typescriptPluginParser,
            parserOptions: { ecmaFeatures: { modules: true }, ecmaVersion: "latest" },
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
