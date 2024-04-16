import { Plugin } from "obsidian";

import { DEFAULT_SETTINGS, ObjoPluginSettings } from "@/types";

export default class ObjoPlugin extends Plugin {
    private settings: ObjoPluginSettings = { ...DEFAULT_SETTINGS };

    public override async onload(): Promise<void> {
        await this.loadSettings();
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
}
