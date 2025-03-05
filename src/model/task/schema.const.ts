import { DateTime } from "luxon";

import { Task, TaskSource, TaskStatus } from "./schema";

export const DEFAULT_DATETIME_VALUE = DateTime.invalid("unspecified");

export const DEFAULT_PRIORITY_VALUE = 3 as const satisfies Task["priority"];

export const DEFAULT_TYPE_VALUE = "UNKNOWN" as const satisfies TaskSource["type"] & TaskStatus["type"];

export const TASK_WITH_DEFAULT_VALUES = {
    status: { type: DEFAULT_TYPE_VALUE },
    source: { type: DEFAULT_TYPE_VALUE },
    dates: {
        cancelled: DEFAULT_DATETIME_VALUE,
        created: DEFAULT_DATETIME_VALUE,
        done: DEFAULT_DATETIME_VALUE,
        due: DEFAULT_DATETIME_VALUE,
        scheduled: DEFAULT_DATETIME_VALUE,
        start: DEFAULT_DATETIME_VALUE,
    },
    description: "",
    priority: DEFAULT_PRIORITY_VALUE,
    tags: new Set(),
    id: "",
    dependsOn: new Set(),
} as const satisfies Task;
