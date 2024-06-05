import { App, MarkdownView, Plugin, PluginManifest } from "obsidian";

import { ReactObsidianComponent } from "@/compat/reactObsidianComponent";
import { createObjoContext, ObjoContextProvider } from "@/contexts/objoContext";
import { DEFAULT_SETTINGS, ObjoPluginSettings } from "@/types/settings";

export default class ObjoPlugin extends Plugin {
    private componentsById: Map<string, ReactObsidianComponent> = new Map();
    private settings: ObjoPluginSettings = { ...DEFAULT_SETTINGS };

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        // Allows me to pass these functions around as values, rather than having to pass: `() => this.xxx()`.
        this.mount = this.mount.bind(this);
        this.remount = this.remount.bind(this);
        this.unmount = this.unmount.bind(this);
    }

    public override async onload() {
        await this.loadSettings();
        this.app.workspace.onLayoutReady(() => {
            this.forEachMarkdownView(this.mount);
            this.registerEvent(this.app.workspace.on("layout-change", () => this.forEachMarkdownView(this.remount)));
        });
    }

    public override onunload() {
        this.forEachMarkdownView(this.unmount);
    }

    private async loadSettings() {
        const data = await this.loadData();
        this.settings = { ...(data ?? {}), ...DEFAULT_SETTINGS };
    }

    private async mount(view: MarkdownView, id: string) {
        if (view.getMode() === "preview" && view.file) {
            const context = createObjoContext(view.file, this.settings);
            if (context) {
                const component = new ReactObsidianComponent(
                    <ObjoContextProvider value={context}>Hello, World!</ObjoContextProvider>,
                    view.containerEl,
                );
                view.addChild(component);
                this.componentsById.set(id, component);
            }
        }
    }

    private unmount(view: MarkdownView, id: string) {
        const component = this.componentsById.get(id);
        if (component) {
            this.componentsById.delete(id);
            view.removeChild(component);
        }
    }

    private remount(view: MarkdownView, id: string) {
        this.unmount(view, id);
        this.mount(view, id);
    }

    private forEachMarkdownView(callback: (view: MarkdownView, id: string) => void) {
        this.app.workspace.iterateAllLeaves((leaf) => {
            // @ts-expect-error "id" is a private property, but its value seems to work as the name implies.
            // See: https://discord.com/channels/686053708261228577/707816848615407697/789658157491945472
            if (leaf.view instanceof MarkdownView && leaf.id) callback(leaf.view, leaf.id);
        });
    }
}
