import { DateTime } from "luxon";

export interface Task {
    status: TaskStatus;
    source: TaskSource;
    dates: TaskDates;
    times: TaskTimes;
    description: string;
    priority: number;
    recurrenceRule: string;
    tags: ReadonlySet<string>;
    id: string;
    dependsOn: ReadonlySet<string>;
}

export type TaskStatus = { type: "CANCELLED" | "CUSTOM" | "DONE" | "OPEN"; symbol: string } | { type: "UNKNOWN" };

export type TaskSource = PageTaskSource | { type: "UNKNOWN" };

export interface TaskDates {
    cancelled: DateTime;
    created: DateTime;
    done: DateTime;
    due: DateTime;
    scheduled: DateTime;
    start: DateTime;
}

export interface TaskTimes {
    start: DateTime;
    end: DateTime;
}

export interface PageTaskSource {
    type: "PAGE";
    path: string;
    name: string;
    section?: string;
    lineNumber: number;
    startByte: number;
    stopByte: number;
    obsidianHref: string;
}
