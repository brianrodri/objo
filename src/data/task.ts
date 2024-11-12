import { DateTime } from "luxon";

import { DataSource } from "@/data/data-source";

export interface Task {
    status: TaskStatus;
    source: DataSource;
    dates: TaskDates;
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
