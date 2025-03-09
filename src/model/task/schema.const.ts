import { DateTime } from "luxon";

import { Task, TaskSource, TaskStatus } from "./schema";

/** The default priority used by {@link Task}s. Different values will always take precedence over this value. */
export const DEFAULT_PRIORITY_VALUE = 3 as const satisfies Task["priority"];

/**
 * The default type used by {@link TaskSource} and {@link TaskStatus}.
 * Different values will always take precedence over this value.
 */
export const DEFAULT_TYPE_VALUE = "UNKNOWN" as const satisfies TaskSource["type"] & TaskStatus["type"];

/** A strongly-typed {@link Task} with all-default values. */
export const TASK_WITH_DEFAULT_VALUES: Task = {
    status: { type: DEFAULT_TYPE_VALUE },
    source: { type: DEFAULT_TYPE_VALUE },
    dates: {
        cancelled: DateTime.invalid("unspecified"),
        created: DateTime.invalid("unspecified"),
        done: DateTime.invalid("unspecified"),
        due: DateTime.invalid("unspecified"),
        scheduled: DateTime.invalid("unspecified"),
        start: DateTime.invalid("unspecified"),
    },
    description: "",
    priority: DEFAULT_PRIORITY_VALUE,
    tags: new Set(),
    id: "",
    dependsOn: new Set(),
};
