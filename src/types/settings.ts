import { DateTimeUnit, DurationLike } from "luxon";

export interface PeriodicLogConfig {
    unit: DateTimeUnit;
    label?: string;
    offset: DurationLike;
    duration: DurationLike;
    folder: string;
    linkedFolders: { label: string; folder: string }[];
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
            offset: 0,
            duration: { day: 1 },
            folder: "01-Fleeting Notes/01-Daily",
            linkedFolders: [
                { label: "Exercise", folder: "01-Fleeting Notes/05-Exercise" },
                { label: "Nutrition", folder: "01-Fleeting Notes/06-Nutrition" },
            ],
            fileNameDateFormat: "yyyy-LL-dd",
            headerDateFormat: "EEEE LLLL d, yyyy",
        },
        {
            unit: "week",
            offset: 0,
            duration: { week: 1 },
            folder: "01-Fleeting Notes/02-Weekly",
            linkedFolders: [],
            fileNameDateFormat: "YYYY 'W'WW",
        },
        {
            unit: "month",
            offset: 0,
            duration: { month: 1 },
            folder: "01-Fleeting Notes/03-Monthly",
            linkedFolders: [],
            fileNameDateFormat: "yyyy-LL",
            headerDateFormat: "LLLL yyyy",
        },
    ],
};
