/** @type {import("typedoc").TypeDocOptions} */
export default {
    entryPoints: ["./src/"],
    entryPointStrategy: "expand",
    cleanOutputDir: false,
    treatWarningsAsErrors: true,
    treatValidationWarningsAsErrors: true,
    warnOnUnstableDtLink: false,
    plugin: ["typedoc-plugin-coverage", "typedoc-plugin-dt-links"],
    exclude: ["./docs/**/*", "./node_modules/**/*", "**/__mocks__/**/*", "**/__tests__/**/*", "**/*.const.ts"],
    projectDocuments: ["docs/architecture/decisions/*.md"],
};
