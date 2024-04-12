import ObjoPlugin from "main";
import { ComponentChildren, createContext } from "preact";
import { PluginContextType } from "types/plugin";

export const PluginContext = createContext<PluginContextType>({});

export interface PluginProviderProps {
    plugin: ObjoPlugin;
    children?: ComponentChildren;
}

export function PluginProvider({ plugin, children }: PluginProviderProps) {
    return <PluginContext.Provider value={{ plugin }}>{children}</PluginContext.Provider>;
}
