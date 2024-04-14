import { PropsWithChildren } from "preact/compat";
import ObjoPlugin from "../plugin";
import { PluginContext } from "../types";

export interface PluginProviderProps {
    plugin: ObjoPlugin;
}

export function PluginProvider({ plugin, children }: PropsWithChildren<PluginProviderProps>) {
    return <PluginContext.Provider value={plugin}>{children}</PluginContext.Provider>;
}
