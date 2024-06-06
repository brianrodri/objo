import { DateTimeUnit } from "luxon";

export interface PeriodicLogConfig {
    unit: DateTimeUnit;
    folder: string;
    fileNameDateFormat: string;
    headerDateFormat?: string;
}

export interface ObjoSettings {
    periodic_logs: PeriodicLogConfig[];
}

export const DEFAULT_SETTINGS: ObjoSettings = {
    periodic_logs: [
        {
            unit: "day",
            folder: "01-Logs/01-Daily",
            fileNameDateFormat: "yyyy-LL-dd",
            headerDateFormat: "EEEE LLLL d, yyyy",
        },
        {
            unit: "week",
            folder: "01-Logs/02-Weekly",
            fileNameDateFormat: "YYYY 'W'WW",
        },
        {
            unit: "month",
            folder: "01-Logs/03-Monthly",
            fileNameDateFormat: "yyyy-LL",
            headerDateFormat: "LLLL yyyy",
        },
    ],
};
