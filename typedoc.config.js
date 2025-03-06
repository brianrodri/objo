/** @type {import("typedoc").TypeDocOptions} */
export default {
    entryPoints: ["./src/"],
    entryPointStrategy: "expand",
    cleanOutputDir: false,
    treatWarningsAsErrors: true,
    treatValidationWarningsAsErrors: true,
    plugin: ["typedoc-plugin-coverage", "@typhonjs-typedoc/typedoc-theme-dmt", "typedoc-plugin-dt-links"],
    theme: "default-modern",
    exclude: ["./docs/**/*", "./node_modules/**/*", "**/__mocks__/**/*", "**/__tests__/**/*", "**/*.const.ts"],

    // https://github.com/typhonjs-typedoc/typedoc-theme-dmt#configuration
    dmtNavigation: { style: "flat" },
};
