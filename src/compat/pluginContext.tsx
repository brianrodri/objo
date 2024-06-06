import { MarkdownView, Plugin, TFile } from "obsidian";
import { createContext, useContext } from "preact/compat";

import { PeriodicLog, resolvePeriodicLog } from "@/collections/periodicLog";
import { ObjoSettings } from "@/types/settings";

export type Collection = PeriodicLog;

export interface ObjoContext {
    plugin: Plugin;
    view: MarkdownView;
    file: TFile;
    collection: Collection;
}

const context = createContext<ObjoContext | null>(null);

export const ObjoContextProvider = context.Provider;

export function useObjoContext(): ObjoContext {
    const { plugin, view, file, collection } = useContext(context) ?? {};
    if (!plugin || !view || !file || !collection) {
        throw new Error("useObjoContext must be used within an ObjoContextProvider");
    }
    return { plugin, view, file, collection };
}

export function newObjoContext(plugin: Plugin, view: MarkdownView, settings: ObjoSettings): ObjoContext | null {
    const file = view.file;
    if (!file) return null;
    const collection = resolvePeriodicLog(file, settings.periodic_logs);
    return collection ? { plugin, view, file, collection } : null;
}
