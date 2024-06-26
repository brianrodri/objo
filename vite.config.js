import preact from "@preact/preset-vite";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(({ mode }) => ({
    plugins: [
        preact(),
        viteStaticCopy({
            targets: [
                { src: "styles.css", dest: "./" },
                { src: "manifest.json", dest: "./" },
            ],
        }),
    ],
    resolve: {
        alias: { "@": "/src" },
    },
    build: {
        emptyOutDir: false, // Otherwise helpful files like ".hotreload" will be wiped.
        lib: {
            entry: "src/plugin.tsx",
            fileName: () => "main.js",
            formats: ["cjs"],
        },
        rollupOptions: {
            treeshake: true,
            external: ["obsidian"],
        },
        sourcemap: mode === "development" ? "inline" : false,
    },
    test: {
        environment: "jsdom",
        dir: "src/",
        coverage: {
            // TODO: Write exhaustive unit tests 😫
            // thresholds: { 100: true },
            include: ["src/"],
            exclude: ["src/plugin.tsx", "src/compat/*"],
        },
    },
}));
