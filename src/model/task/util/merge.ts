import _ from "lodash";
import { DateTime } from "luxon";
import { DeepPartial } from "utility-types";

import { DEFAULT_PRIORITY_VALUE, DEFAULT_TYPE_VALUE, TASK_WITH_DEFAULT_VALUES } from "@/model/task/constants";
import { Task } from "@/model/task/schema";

/**
 * Builds a new Task using values from parts.
 *
 * Each property in the Task will use the first non-default value encountered in the list of parts.
 *
 * @see {@link TASK_WITH_DEFAULT_VALUES}
 */
export function mergeTaskParts(...parts: DeepPartial<Task>[]): Task {
    return parts.reduce(replaceDefaultValues, { ...TASK_WITH_DEFAULT_VALUES });
}

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
