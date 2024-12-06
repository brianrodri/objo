/* v8 ignore next 2 */
// TODO: Why does v8 consider this line to be untested?
import { MergeWithCustomizer, isNumber, isSet, isString, mergeWith } from "lodash";
import { DateTime } from "luxon";
import { DeepPartial } from "utility-types";
import { Task } from "@/data/task";

const DEFAULT_TYPE_VALUE = "UNKNOWN" as const;
const DEFAULT_PRIORITY_VALUE = 3 as const;

export function mergeTasks(...parts: DeepPartial<Task>[]): Task {
    const initialTask: Task = {
        status: { type: DEFAULT_TYPE_VALUE },
        source: { type: DEFAULT_TYPE_VALUE },
        dates: {
            cancelled: DateTime.invalid("cancelled is unspecified"),
            created: DateTime.invalid("created is unspecified"),
            done: DateTime.invalid("done is unspecified"),
            due: DateTime.invalid("due is unspecified"),
            scheduled: DateTime.invalid("scheduled is unspecified"),
            start: DateTime.invalid("start is unspecified"),
        },
        times: {
            start: DateTime.invalid("start is unspecified"),
            end: DateTime.invalid("end is unspecified"),
        },
        description: "",
        priority: DEFAULT_PRIORITY_VALUE,
        recurrenceRule: "",
        tags: new Set(),
        id: "",
        dependsOn: new Set(),
    };

    return parts.reduce<Task>((task, part) => mergeWith(task, part, CUSTOMIZER), initialTask);
}

const CUSTOMIZER: MergeWithCustomizer = (oldValue, newValue, key) => {
    if (key === "type" && isString(oldValue) && isString(newValue)) {
        return oldValue !== DEFAULT_TYPE_VALUE ? oldValue : newValue;
    }
    if (key === "priority" && isNumber(oldValue) && isNumber(newValue)) {
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
