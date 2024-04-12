import { createContext } from "preact";
import ObjoPlugin from "../main";

export interface PluginContextType {
    plugin?: ObjoPlugin;
}

export const PluginContext = createContext<PluginContextType>({});
