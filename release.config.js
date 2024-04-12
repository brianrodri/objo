/** @type { import("@semantic-release/release-config").ReleaseConfig } */
export default {
    branches: ["main"],
    plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "semantic-release-obsidian-plugin",
        [
            "@semantic-release/git",
            {
                assets: ["package.json", "package-lock.json", "manifest.json", "versions.json"],
                message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
            },
        ],
        [
            "@semantic-release/github",
            {
                assets: ["dist/main.js", "dist/manifest.json", "dist/styles.css"],
            },
        ],
    ],
    tagFormat: "${version}",
};
