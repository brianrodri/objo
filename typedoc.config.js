/** @type {import("typedoc").TypeDocOptions} */
export default {
    entryPoints: ["./src/"],
    entryPointStrategy: "expand",
    plugin: ["typedoc-plugin-coverage", "typedoc-github-theme", "typedoc-plugin-dt-links"],
    exclude: ["./docs/**/*", "./node_modules/**/*", "**/__tests__/**/*"],
};
