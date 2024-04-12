import { DataviewApi } from "obsidian-dataview";
import { createContext } from "preact";

export const DataviewContext = createContext<DataviewApi>(undefined);
