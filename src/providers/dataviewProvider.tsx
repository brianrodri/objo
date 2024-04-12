import { DataviewApi, getAPI } from "obsidian-dataview";
import { PropsWithChildren } from "preact/compat";
import { DataviewContext } from "../types/dataviewContext";

export interface DataviewProviderProps {
    api?: DataviewApi;
}

export function DataviewProvider({ api, children }: PropsWithChildren<DataviewProviderProps>) {
    return <DataviewContext.Provider value={api ?? getAPI()}>{children}</DataviewContext.Provider>;
}
