import { MarkdownView, Plugin } from "obsidian";
import { VNode } from "preact";
import { render, unmountComponentAtNode } from "preact/compat";

import { DEFAULT_SETTINGS, ObjoPluginSettings } from "@/types/settings";

export default class ObjoPlugin extends Plugin {
    private settings: ObjoPluginSettings = { ...DEFAULT_SETTINGS };

    public override async onload(): Promise<void> {
        await this.loadSettings();
        this.app.workspace.onLayoutReady(() => {
            this.mountObjoComponents();
            this.registerEvent(this.app.workspace.on("layout-change", () => this.mountObjoComponents()));
        });
    }

    public getSettings(): ObjoPluginSettings {
        return this.settings;
    }

    public overwriteSettings(changes: Partial<ObjoPluginSettings>): void {
        this.settings = { ...this.settings, ...changes };
    }

    public async loadSettings(): Promise<void> {
        const data = await this.loadData();
        this.settings = { ...DEFAULT_SETTINGS, ...data };
    }

    public async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }

    private mountObjoComponents() {
        for (const { view } of this.app.workspace.getLeavesOfType("markdown")) {
            if (view instanceof MarkdownView) {
                const objoComponent = <h1>Hello, World!</h1>;
                mountObjoComponent(objoComponent, view);
            }
        }
    }
}

// Used to identify the root element in a workspace leaf.
const ROOT_CLASS_NAME = "OBJO-ROOT-ELEMENT-CLASS";

// See: https://forum.obsidian.md/t/header-counter/3525/7
const REQUIRED_CLASSES = ["markdown-preview-sizer", "markdown-preview-section"];

function mountObjoComponent(objoComponent: VNode, view: MarkdownView): void {
    const containerEl = view.containerEl.querySelector(".markdown-reading-view > .markdown-preview-view");
    const existingRootEl = view.containerEl.querySelector(`.${ROOT_CLASS_NAME}`);

    if (containerEl && view.getMode() === "preview") {
        const rootEl = existingRootEl ?? view.containerEl.createDiv({ cls: [ROOT_CLASS_NAME, ...REQUIRED_CLASSES] });
        if (existingRootEl) unmountComponentAtNode(existingRootEl);
        containerEl.prepend(rootEl);
        render(objoComponent, rootEl);
        view.register(() => unmountComponentAtNode(rootEl));
    } else if (existingRootEl) {
        unmountComponentAtNode(existingRootEl);
        existingRootEl.remove();
    }
}
