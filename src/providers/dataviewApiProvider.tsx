import { getAPI } from "obsidian-dataview";
import { PropsWithChildren } from "preact/compat";
import { DataviewApiContext } from "../types/dataviewApiContext";

export interface DataviewApiProviderProps {}

export function DataviewApiProvider({ children }: PropsWithChildren<DataviewApiProviderProps>) {
    return <DataviewApiContext.Provider value={getAPI()}>{children}</DataviewApiContext.Provider>;
}
