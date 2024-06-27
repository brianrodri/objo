import { App, MarkdownView, Notice, Plugin, PluginManifest } from "obsidian";

import { ensureDataviewEnabled } from "@/compat/ensureDataviewEnabled";
import { newObjoContext, ObjoContextProvider } from "@/compat/pluginContext";
import { PreactComponent } from "@/compat/preactComponent";
import { DEFAULT_SETTINGS, ObjoSettings } from "@/types/settings";
import { Breadcrumbs } from "@/views/breadcrumbs";
import { Header } from "@/views/header";
import { PendingTasks } from "@/views/pending-tasks";

import { CompletedTasks } from "./views/completed-tasks";

export default class ObjoPlugin extends Plugin {
    private componentsByLeafId: Map<string, PreactComponent> = new Map();
    private settings: ObjoSettings = { ...DEFAULT_SETTINGS };

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        // Allows me to pass these functions around as values, rather than having to pass: `() => this.xxx()`.
        this.remount = this.remount.bind(this);
        this.unmount = this.unmount.bind(this);
    }

    public override async onload() {
        try {
            await ensureDataviewEnabled(this);
        } catch (err) {
            // @ts-expect-error: `plugins` is a private field.
            await this.app.plugins.disablePluginAndSave("objo");
            new Notice("Objo requires the Dataview plugin to be enabled.");
            return;
        }

        await this.loadSettings();
        this.app.workspace.onLayoutReady(() => {
            this.forEachMarkdownView(this.remount);
            this.registerEvent(this.app.workspace.on("layout-change", () => this.forEachMarkdownView(this.remount)));
        });
    }

    public override onunload() {
        this.forEachMarkdownView(this.unmount);
    }

    private async loadSettings() {
        const data = (await this.loadData()) ?? {};
        this.settings = { ...DEFAULT_SETTINGS, ...data };
    }

    private remount(leafId: string, leafView: MarkdownView) {
        const existingComponent = this.componentsByLeafId.get(leafId);
        if (existingComponent) {
            if (leafView.getMode() === "preview" && existingComponent.filePath === leafView.file?.path) {
                // This view and its component are still in-sync; no need to remount.
                return;
            } else {
                this.componentsByLeafId.delete(leafId);
                leafView.removeChild(existingComponent);
            }
        }

        // Objo only renders in preview mode.
        if (leafView.getMode() !== "preview") return;

        const context = newObjoContext(this, leafView, this.settings);
        if (!context) return;

        const reactEl = (
            <ObjoContextProvider value={context}>
                <Header />
                <Breadcrumbs />
                <PendingTasks />
                <CompletedTasks />
            </ObjoContextProvider>
        );
        const component = leafView.addChild(new PreactComponent(context.file.path, reactEl, leafView.containerEl));
        this.componentsByLeafId.set(leafId, component);
    }

    private unmount(leafId: string, leafView: MarkdownView) {
        const component = this.componentsByLeafId.get(leafId);
        if (!component) return;
        this.componentsByLeafId.delete(leafId);
        leafView.removeChild(component);
    }

    private forEachMarkdownView(callback: (leafId: string, leafView: MarkdownView) => void) {
        // @ts-expect-error: `id` is a private field.
        this.app.workspace.iterateAllLeaves(({ id, view }) => {
            if (id && view instanceof MarkdownView) callback(id, view);
        });
    }
}
