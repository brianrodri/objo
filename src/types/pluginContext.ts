import { createContext } from "preact";

import ObjoPlugin from "@/plugin";

export const PluginContext = createContext<ObjoPlugin | undefined>(undefined);
