import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "path";
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
    build: {
        emptyOutDir: false, // Otherwise helpful files like ".hotreload" will be wiped.
        lib: {
            entry: "src/main.tsx",
            fileName: () => "main.js",
            formats: ["cjs"],
        },
        rollupOptions: {
            treeshake: true,
            external: ["obsidian"],
        },
        sourcemap: mode === "development" ? "inline" : false,
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "/src"),
            "react": "preact/compat",
            "react-dom": "preact/compat",
        },
    },
    test: {
        environment: "jsdom",
        include: ["src/**/__tests__/**/*.test.{ts,tsx}"],
        coverage: {
            all: true,
            include: ["src/"],
            exclude: ["src/main.tsx", "src/lib"],
            thresholds: { 100: true },
            reporter: ["text", "html", "clover", "json", "lcov"],
        },
        reporters: [["junit", { outputFile: "test-report.junit.xml" }], "verbose"],
    },
}));
