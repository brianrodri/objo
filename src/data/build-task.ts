import { Task, TaskSource, TaskStatus } from "@/data/task";
import { DateTime } from "luxon";
import { DeepPartial } from "utility-types";
import _ from "lodash";

/**
 * Builds a new {@link Task} using values from {@link parts}.
 *
 * Each property in the Task will use the first non-default value encountered in the list of parts.
 *
 * @see {@link TASK_WITH_DEFAULT_VALUES}
 */
export function buildTask(...parts: DeepPartial<Task>[]): Task {
    return parts.reduce(takeNonDefaultValues, { ...TASK_WITH_DEFAULT_VALUES });
}

function takeNonDefaultValues(task: Task, part: DeepPartial<Task>): Task {
    return _.mergeWith(task, part, (taskValue, partValue, propName) => {
        if (propName === "type" && _.isString(taskValue) && _.isString(partValue)) {
            return taskValue !== DEFAULT_TYPE_VALUE ? taskValue : partValue;
        }
        if (propName === "priority" && _.isNumber(taskValue) && _.isNumber(partValue)) {
            return taskValue !== DEFAULT_PRIORITY_VALUE ? taskValue : partValue;
        }
        if (_.isSet(taskValue) && _.isSet(partValue)) {
            return new Set([...taskValue, ...partValue]);
        }
        if (DateTime.isDateTime(taskValue) && DateTime.isDateTime(partValue)) {
            return taskValue.isValid ? taskValue : partValue;
        }
        if (_.isString(taskValue) && _.isString(partValue)) {
            return taskValue !== "" ? taskValue : partValue;
        }
    });
}

const DEFAULT_DATETIME_VALUE = DateTime.invalid("unspecified");
const DEFAULT_PRIORITY_VALUE = 3 as const satisfies Task["priority"];
const DEFAULT_TYPE_VALUE = "UNKNOWN" as const satisfies TaskSource["type"] & TaskStatus["type"];

const TASK_WITH_DEFAULT_VALUES = {
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
    times: {
        start: DEFAULT_DATETIME_VALUE,
        end: DEFAULT_DATETIME_VALUE,
    },
    description: "",
    priority: DEFAULT_PRIORITY_VALUE,
    recurrenceRule: "",
    tags: new Set(),
    id: "",
    dependsOn: new Set(),
} as const satisfies Task;
