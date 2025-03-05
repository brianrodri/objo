import _ from "lodash";
import { DateTime } from "luxon";
import { DeepPartial } from "utility-types";

import { DEFAULT_PRIORITY_VALUE, DEFAULT_TYPE_VALUE, Task, TASK_WITH_DEFAULT_VALUES } from "@/model/task/schema";

/**
 * @param parts - the task pieces to merge.
 * @returns a new {@link Task} with values taken from the front-most non-default parts encountered.
 */
export function mergeTaskParts(...parts: DeepPartial<Task>[]): Task {
    return parts.reduce(replaceDefaultValues, { ...TASK_WITH_DEFAULT_VALUES });
}

/**
 * Replaces any default values in {@link task} with non-default values from {@link part}.
 * @param task - the task to modify.
 * @param part - the task piece to take from.
 * @returns the modified {@link Task}.
 */
function replaceDefaultValues(task: Task, part: DeepPartial<Task>): Task {
    return _.mergeWith(task, part, (oldValue, newValue, propName) => {
        if (propName === "type" && _.isString(oldValue) && _.isString(newValue)) {
            return oldValue !== DEFAULT_TYPE_VALUE ? oldValue : newValue;
        }
        if (propName === "priority" && _.isNumber(oldValue) && _.isNumber(newValue)) {
            return oldValue !== DEFAULT_PRIORITY_VALUE ? oldValue : newValue;
        }
        if (_.isSet(oldValue) && _.isSet(newValue)) {
            return new Set([...oldValue, ...newValue]);
        }
        if (DateTime.isDateTime(oldValue) && DateTime.isDateTime(newValue)) {
            return oldValue.isValid ? oldValue : newValue;
        }
        if (_.isString(oldValue) && _.isString(newValue)) {
            return oldValue !== "" ? oldValue : newValue;
        }
    });
}
