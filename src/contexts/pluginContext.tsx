import { createContext, PropsWithChildren } from "preact/compat";

import ObjoPlugin from "@/plugin";

export const PluginContext = createContext<ObjoPlugin | undefined>(undefined);

export interface PluginProviderProps {
    plugin: ObjoPlugin;
}

export function PluginProvider({ plugin, children }: PropsWithChildren<PluginProviderProps>) {
    return <PluginContext.Provider value={plugin}>{children}</PluginContext.Provider>;
}
