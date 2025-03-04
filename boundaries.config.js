const libDir = "lib";

// EXPORTS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

export const ELEMENT_TYPE_RULES = [
    { from: "*", allow: "shared" },
    { from: "main", allow: [["lib", { lib: "obsidian" }]] },
    { from: "(lib|lib:scope)", allow: [["lib", { lib: "${from.lib}" }]] },
    { from: "const", disallow: "*" },

    ...fromScopeAllowItself("model"),
    ...fromScopeElementAllowTargetScopeElements("model", "index", [["model", "collection"]]),
];

export const EXTERNAL_RULES = [
    { from: "*", allow: ["aggregate-error", "assert", "lodash", "luxon", "path", "utility-types"] },
    { from: "lib", allow: "${from.lib}" },
];

// HELPERS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function defineFolderScope(folderName) {
    return { type: folderName, pattern: `src/(${folderName})/*`, capture: ["scope", "elementName"], mode: "folder" };
}

function fromScopeAllowItself(scope) {
    return [
        {
            from: `(${scope}|lib:scope)`,
            allow: [[`(${scope}|lib:scope)`, { scope, elementName: "${from.elementName}" }]],
        },
    ];
}

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
