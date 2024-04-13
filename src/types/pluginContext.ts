import { createContext } from "preact";
import ObjoPlugin from "../main";

export const PluginContext = createContext<ObjoPlugin | undefined>(undefined);
