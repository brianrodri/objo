import { getAPI } from "obsidian-dataview";
import { DataviewApi } from "obsidian-dataview";
import { createContext } from "preact";
import { PropsWithChildren } from "preact/compat";

export const DataviewApiContext = createContext<DataviewApi | undefined>(undefined);

export interface DataviewApiProviderProps {}

export function DataviewApiProvider({ children }: PropsWithChildren<DataviewApiProviderProps>) {
    return <DataviewApiContext.Provider value={getAPI()}>{children}</DataviewApiContext.Provider>;
}
