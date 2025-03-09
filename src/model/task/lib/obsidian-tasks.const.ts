import { escapeRegExp, keysIn } from "lodash";
import { PickByValue } from "utility-types";

import { Task } from "@/model/task/schema";
import { PathsOf } from "@/util/type-utils";

export const SYMBOL_PATH_LOOKUP = {
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
} as const satisfies Record<string, PathsOf<Task>>;

export const SYMBOL_PRIORITY_LOOKUP = {
    "🔺": 0,
    "⏫": 1,
    "🔼": 2,
    "🔽": 4,
    "⏬": 5,
} as const satisfies { [K in keyof PickByValue<typeof SYMBOL_PATH_LOOKUP, "priority">]: number };

export const SYMBOL_REG_EXP = new RegExp(keysIn(SYMBOL_PATH_LOOKUP).map(escapeRegExp).join("|"), "g");
