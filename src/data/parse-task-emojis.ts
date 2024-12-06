import { DateTime, Interval } from "luxon";
import { Dictionary, set } from "lodash";
import { DeepPartial } from "utility-types";
import { Task } from "@/data/task";

export function parseTaskEmojis(text: string): DeepPartial<Task> {
    const matches = [...text.matchAll(EMOJI_REGEXP), /$/.exec(text) as RegExpExecArray];

    const taskHeader = text.slice(0, matches[0].index).trim();
    const taskParts: DeepPartial<Task> = { ...parseTaskHeader(taskHeader), dates: {} };

    for (let i = 0; i <= matches.length - 2; ++i) {
        const [start, stop] = matches.slice(i, i + 2);

        const emoji = start[0];
        const path = TASK_PATH_BY_EMOJI[emoji];
        const value = text.slice(start.index + emoji.length, stop.index);

        if (path.startsWith("dates.")) {
            set(taskParts, path, DateTime.fromISO(value.trim()));
        } else if (path === "priority") {
            set(taskParts, path, PRIORITY_VALUE_BY_EMOJI[emoji]);
        } else if (path === "dependsOn") {
            set(taskParts, path, new Set(value.split(",").map((v) => v.trim())));
        } else {
            set(taskParts, path, value.trim());
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

const TASK_PATH_BY_EMOJI: Readonly<Dictionary<string>> = {
    "❌": "dates.cancelled",
    "➕": "dates.created",
    "✅": "dates.done",
    "📅": "dates.due",
    "⌛": "dates.scheduled",
    "⏳": "dates.scheduled",
    "🛫": "dates.start",
    "⛔": "dependsOn",
    "🆔": "id",
    "🔺": "priority",
    "⏫": "priority",
    "🔼": "priority",
    "🔽": "priority",
    "⏬": "priority",
    "🔁": "recurrenceRule",
};

const PRIORITY_VALUE_BY_EMOJI: Readonly<Dictionary<number>> = {
    "🔺": 0,
    "⏫": 1,
    "🔼": 2,
    "🔽": 4,
    "⏬": 5,
};

const EMOJI_REGEXP = new RegExp(Object.keys(TASK_PATH_BY_EMOJI).join("|"), "g");
