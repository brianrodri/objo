const libDir = "lib";

// EXPORTS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** @see {@link https://github.com/javierbrea/eslint-plugin-boundaries#rules-configuration} */
export const ELEMENTS = [
    { type: "shared", pattern: "src/util", mode: "folder" },
    { type: "main", pattern: "src/main.tsx", mode: "full" },

    {
        type: "lib",
        pattern: `src/${libDir}/*/**/*`,
        capture: ["lib"],
        mode: "full",
    },
    {
        type: `lib:scope`,
        pattern: [`src/*/*/${libDir}/*.*`, `src/*/*/${libDir}/*/**/*`],
        capture: ["scope", "elementName", "lib"],
        mode: "full",
    },
    {
        type: "const",
        pattern: "*.const.ts",
        mode: "file",
    },

    defineFolderScope("model"),
];

/** @see {@link https://github.com/javierbrea/eslint-plugin-boundaries#rules-configuration} */
export const ELEMENT_TYPE_RULES = [
    { from: "*", allow: "shared" },
    { from: "main", allow: [["lib", { lib: "obsidian" }]] },
    { from: "(lib|lib:scope)", allow: [["lib", { lib: "${from.lib}" }]] },
    { from: "const", allow: "./*" },

    ...fromScopeAllowItself("model"),
    ...fromScopeElementAllowTargetScopeElements("model", "index", [["model", "collection"]]),
];

/** @see {@link https://github.com/javierbrea/eslint-plugin-boundaries#rules-configuration} */
export const EXTERNAL_RULES = [
    { from: "*", allow: ["aggregate-error", "assert", "lodash", "luxon", "path", "utility-types"] },
    { from: "lib", allow: "${from.lib}" },
];

/**
 * Defines a "scope" of code, or a folder that needs explicit permission to import from anywhere else.
 * @param {string} folderName - the name of the folder and, consequently, the scope.
 * @returns {object} the eslint-plugin-boundaries rule that will define the scope as its own type.
 */
function defineFolderScope(folderName) {
    return { type: folderName, pattern: `src/(${folderName})/*`, capture: ["scope", "elementName"], mode: "folder" };
}

/**
 * @param {string} scope - the name of the scope.
 * @returns {Array} the set of rules that will allow "scopes" to import from code in the same folder.
 */
function fromScopeAllowItself(scope) {
    return [
        {
            from: `(${scope}|lib:scope)`,
            allow: [[`(${scope}|lib:scope)`, { scope, elementName: "${from.elementName}" }]],
        },
    ];
}

/**
 * @param {string} fromScope - the scope where imports will be allowed from.
 * @param {string} fromElementName - the name of the scope-element (i.e., "src/model/task" -> "task").
 * @param {Array} targets - the list of scope/name pairs to allow imports from.
 * @returns {Array} the set of rules that will allow "scopes" to import from code in the same folder.
 */
function fromScopeElementAllowTargetScopeElements(fromScope, fromElementName, targets) {
    return [
        {
            from: [[`(${fromScope}|lib:scope)`, { scope: fromScope, elementName: fromElementName }]],
            allow: targets.map(([scope, elementName]) => [scope, { scope, elementName }]),
        },
        {
            from: [["lib:scope", { scope: fromScope, elementName: fromElementName }]],
            allow: targets.map(([scope, elementName]) => ["lib:scope", { scope, elementName, lib: "${from.lib}" }]),
        },
    ];
}
