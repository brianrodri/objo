import { isNumber, isSet, isString, mergeWith, MergeWithCustomizer } from "lodash";
import { DateTime } from "luxon";
import { DeepPartial } from "utility-types";

import { DEFAULT_PRIORITY_VALUE, DEFAULT_TYPE_VALUE, Task, TASK_WITH_DEFAULT_VALUES } from "@/model/task/schema";

/**
 * Merges multiple partial Task objects into a complete Task using a custom merge strategy.
 * The function begins with default Task values and sequentially merges each provided partial Task. For each property, the front-most non-default value is retained. Special handling is applied for properties such as task type, priority, strings, DateTime objects, and Set collections.
 * @param parts - The partial Task objects to merge.
 * @returns new {@link Task} with the front-most non-default values taken from the parts.
 */
export function mergeTaskParts(...parts: DeepPartial<Task>[]): Task {
    const defaults = { ...TASK_WITH_DEFAULT_VALUES };
    return parts.reduce<Task>((task, part) => mergeWith(task, part, TAKE_NON_DEFAULT_VALUES), defaults);
}

const TAKE_NON_DEFAULT_VALUES: MergeWithCustomizer = (oldValue, newValue, propName) => {
    if (propName === "type" && isString(oldValue) && isString(newValue)) {
        return oldValue !== DEFAULT_TYPE_VALUE ? oldValue : newValue;
    }
    if (propName === "priority" && isNumber(oldValue) && isNumber(newValue)) {
        return oldValue !== DEFAULT_PRIORITY_VALUE ? oldValue : newValue;
    }
    if (isSet(oldValue) && isSet(newValue)) {
        return new Set([...oldValue, ...newValue]);
    }
    if (DateTime.isDateTime(oldValue) && DateTime.isDateTime(newValue)) {
        return oldValue.isValid ? oldValue : newValue;
    }
    if (isString(oldValue) && isString(newValue)) {
        return oldValue !== "" ? oldValue : newValue;
    }
};
