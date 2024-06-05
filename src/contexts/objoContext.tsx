import { TFile } from "obsidian";
import { createContext, useContext } from "preact/compat";

import { ObjoPluginSettings } from "@/types/settings";

export interface ObjoContext {
    file: TFile;
    settings: ObjoPluginSettings;
}

export const objoContext = createContext<Partial<ObjoContext>>({});

export const useObjoContext = () => {
    const context = useContext(objoContext);
    if (!context.file || !context.settings) {
        throw new Error("useObjoContext must be used within an ObjoContextProvider");
    }
    return context as ObjoContext;
};

export const ObjoContextProvider = objoContext.Provider;
