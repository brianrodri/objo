import { DataSource } from "@/data/data-source";
import { DateTime } from "luxon";

export interface Task {
    status: TaskStatus;
    source: DataSource;
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

export type TaskStatusType = TaskStatus["type"];

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
