import { PropsWithChildren } from "preact/compat";
import ObjoPlugin from "../main";
import { PluginContext } from "../types/pluginContext";

export interface PluginProviderProps {
    plugin: ObjoPlugin;
}

export function PluginProvider({ plugin, children }: PropsWithChildren<PluginProviderProps>) {
    return <PluginContext.Provider value={plugin}>{children}</PluginContext.Provider>;
}
