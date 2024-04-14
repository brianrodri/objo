import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, ObjoPluginSettings } from "./types/settings";

export default class ObjoPlugin extends Plugin {
    private settings: ObjoPluginSettings = { ...DEFAULT_SETTINGS };

    public override async onload(): Promise<void> {
        await this.loadSettings();
    }

    /** Returns the plugin settings. */
    public getSettings(): ObjoPluginSettings {
        return this.settings;
    }

    /** Updates the plugin settings. */
    public overwriteSettings(changes: Partial<ObjoPluginSettings>): void {
        this.settings = { ...this.settings, ...changes };
    }

    /** Asynchronously loads the plugin settings from Obsidian's configuration storage. */
    public async loadSettings(): Promise<void> {
        const data = await this.loadData();
        this.settings = { ...DEFAULT_SETTINGS, ...data };
    }

    /** Asynchronously saves the plugin settings to Obsidian's configuration storage. */
    public async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }
}
