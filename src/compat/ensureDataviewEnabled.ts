import { Plugin } from "obsidian";
import { getAPI, isPluginEnabled } from "obsidian-dataview";

export async function ensureDataviewEnabled(plugin: Plugin) {
    return new Promise<void>((resolve, reject) => {
        if (!isPluginEnabled(plugin.app)) {
            reject();
        } else if (getAPI()?.index.initialized) {
            resolve();
        } else {
            // @ts-expect-error: "dataview:index-ready" is a third-party event missing from obsidian's type definitions.
            plugin.registerEvent(plugin.app.metadataCache.on("dataview:index-ready", resolve));
        }
    });
}
