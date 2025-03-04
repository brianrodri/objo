/** @type {import("typedoc").TypeDocOptions} */
export default {
    entryPoints: ["./src/"],
    entryPointStrategy: "expand",
    exclude: ["./docs/**/*", "./node_modules/**/*", "**/__tests__/**/*", "**/*.const.ts"],
    plugin: ["typedoc-plugin-coverage", "typedoc-github-theme"],
};
