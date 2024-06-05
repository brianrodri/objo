import { DateTimeUnit } from "luxon";

interface PeriodicLogConfig {
    folder: string;
    fileNameFormat: string;
    unit: DateTimeUnit;
    header?: boolean;
    breadcrumbs?: boolean;
}

export interface ObjoPluginSettings {
    periodic_logs: PeriodicLogConfig[];
}

export const DEFAULT_SETTINGS: ObjoPluginSettings = {
    periodic_logs: [
        {
            unit: "day",
            folder: "01-Logs/01-Daily",
            fileNameFormat: "yyyy-MM-dd",
            header: true,
            breadcrumbs: true,
        },
        {
            unit: "week",
            folder: "01-Logs/02-Weekly",
            fileNameFormat: "YYYY 'W'WW",
            header: true,
            breadcrumbs: true,
        },
        {
            unit: "month",
            folder: "01-Logs/03-Monthly",
            fileNameFormat: "yyyy-MM",
            header: true,
            breadcrumbs: true,
        },
    ],
};
