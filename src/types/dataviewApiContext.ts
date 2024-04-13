import { DataviewApi } from "obsidian-dataview";
import { createContext } from "preact";

export const DataviewApiContext = createContext<DataviewApi | undefined>(undefined);
