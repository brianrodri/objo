import { DateTime } from "luxon";

import { Task, TaskSource, TaskStatus } from "./schema";

/** The default date used by {@link Task}s. Valid dates will always take precedence over this value. */
export const DEFAULT_DATETIME_VALUE: DateTime = DateTime.invalid("unspecified");

/** The default priority used by {@link Task}s. Different values will always take precedence over this value. */
export const DEFAULT_PRIORITY_VALUE: Task["priority"] = 3;

/**
 * The default type used by {@link TaskSource} and {@link TaskStatus}.
 * Different values will always take precedence over this value.
 */
export const DEFAULT_TYPE_VALUE: TaskSource["type"] & TaskStatus["type"] = "UNKNOWN";

/** A strongly-typed {@link Task} with all-default values. */
export const TASK_WITH_DEFAULT_VALUES: Task = {
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
};
