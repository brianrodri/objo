export interface UnknownDataSource {
    type: "UNKNOWN";
}

export interface PageDataSource {
    type: "PAGE";
    path: string;
    name: string;
    section?: string;
    lineNumber: number;
    startByte: number;
    stopByte: number;
    obsidianHref: string;
}

export type DataSource = UnknownDataSource | PageDataSource;

export type DataSourceType = DataSource["type"];
