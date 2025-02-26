import { escapeRegExp, has, set } from "lodash";
import { DateTime, Interval } from "luxon";
import { DeepPartial } from "utility-types";
import { Task } from "@/model/task/schema";
import { PathOf } from "@/util/type-utils";

const SYMBOL_PATH_MAP: ReadonlyMap<string, PathOf<Task>> = new Map([
    ["❌", "dates.cancelled"],
    ["➕", "dates.created"],
    ["✅", "dates.done"],
    ["📅", "dates.due"],
    ["⌛", "dates.scheduled"],
    ["⏳", "dates.scheduled"],
    ["🛫", "dates.start"],
    ["⛔", "dependsOn"],
    ["🆔", "id"],
    ["🔺", "priority"],
    ["⏫", "priority"],
    ["🔼", "priority"],
    ["🔽", "priority"],
    ["⏬", "priority"],
    ["🔁", "recurrenceRule"],
]);

const SYMBOL_PRIORITY_MAP = { "🔺": 0, "⏫": 1, "🔼": 2, "🔽": 4, "⏬": 5 };

const SYMBOL_REGEXP = new RegExp([...SYMBOL_PATH_MAP.keys()].map(escapeRegExp).join("|"), "g");

export function parseTaskEmojis(text: string): DeepPartial<Task> {
    const matches = [...text.matchAll(SYMBOL_REGEXP), /$/.exec(text) as RegExpExecArray];

    const taskHeader = text.slice(0, matches[0].index).trim();
    const taskParts: DeepPartial<Task> = { ...parseTaskHeader(taskHeader), dates: {} };

    for (let i = 0; i <= matches.length - 2; ++i) {
        const [execArray, nextExecArray] = matches.slice(i, i + 2);

        const symbol = execArray[0];
        const taskPartPath = SYMBOL_PATH_MAP.get(symbol) as PathOf<Task>;
        const value = text.slice(execArray.index + symbol.length, nextExecArray.index);

        if (has(SYMBOL_PRIORITY_MAP, symbol)) {
            // TODO: `value` is unused in this branch; should I do something with it?
            set(taskParts, taskPartPath, SYMBOL_PRIORITY_MAP[symbol]);
        } else if (taskPartPath.startsWith("dates.")) {
            set(taskParts, taskPartPath, DateTime.fromISO(value.trim()));
        } else if (taskPartPath === "dependsOn") {
            set(taskParts, taskPartPath, new Set(value.split(",").map((v) => v.trim())));
        } else {
            set(taskParts, taskPartPath, value.trim());
        }
    }

    return taskParts;
}

function parseTaskHeader(header: string): DeepPartial<Task> {
    const [isoTime, description] = header.split(/\s+/, 2);

    const interval = Interval.fromISO(isoTime);
    if (interval.isValid) {
        return { description, times: { start: interval.start, end: interval.end } };
    }

    const time = DateTime.fromISO(isoTime);
    if (time.isValid) {
        return { description, times: { start: time } };
    }

    return { description: header };
}
