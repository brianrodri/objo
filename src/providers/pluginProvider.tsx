import { ComponentChildren } from "preact";
import ObjoPlugin from "../main";
import { PluginContext } from "../types/pluginContext";

export interface PluginProviderProps {
    plugin: ObjoPlugin;
    children?: ComponentChildren;
}

export function PluginProvider({ plugin, children }: PluginProviderProps) {
    return <PluginContext.Provider value={{ plugin }}>{children}</PluginContext.Provider>;
}
