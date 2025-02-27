import { escapeRegExp, has, keysIn, set } from "lodash";
import { DateTime, Interval } from "luxon";
import { DeepPartial, PickByValue } from "utility-types";
import { Task } from "@/model/task/schema";
import { PathOf } from "@/util/type-utils";

export function parseTaskEmojis(text: string): DeepPartial<Task> {
    const matchedSymbols = [...text.matchAll(SYMBOL_REG_EXP), /$/.exec(text) as RegExpExecArray];
    const textBeforeAllSymbols = text.slice(0, matchedSymbols[0].index);
    const result = parseTaskHeader(textBeforeAllSymbols.trim());

    for (let i = 0; i <= matchedSymbols.length - 2; ++i) {
        const [execArray, nextExecArray] = matchedSymbols.slice(i, i + 2);

        const symbol = execArray[0] as keyof typeof SYMBOL_PATH_LOOKUP;
        const symbolPath = SYMBOL_PATH_LOOKUP[symbol];
        const textAfterSymbol = text.slice(execArray.index + symbol.length, nextExecArray.index);

        if (symbolPath === "priority" && has(SYMBOL_PRIORITY_LOOKUP, symbol)) {
            // TODO: `textAfterSymbol` is unused in this branch; should I do something with it?
            set(result, symbolPath, SYMBOL_PRIORITY_LOOKUP[symbol]);
        } else if (symbolPath === "dependsOn") {
            set(result, symbolPath, new Set(textAfterSymbol.split(",").map((v) => v.trim())));
        } else if (symbolPath.startsWith("dates.")) {
            set(result, symbolPath, DateTime.fromISO(textAfterSymbol.trim()));
        } else {
            set(result, symbolPath, textAfterSymbol.trim());
        }
    }

    return result;
}

function parseTaskHeader(headerText: string): DeepPartial<Task> {
    const [isoString, isoStringSuffix] = headerText.split(/\s+/, 2);

    const interval = Interval.fromISO(isoString);
    if (interval.isValid) {
        return { times: { start: interval.start, end: interval.end }, description: isoStringSuffix };
    }

    const time = DateTime.fromISO(isoString);
    if (time.isValid) {
        return { times: { start: time }, description: isoStringSuffix };
    }

    return { description: headerText };
}

const SYMBOL_PATH_LOOKUP = {
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
} as const satisfies Record<string, PathOf<Task>>;

const SYMBOL_PRIORITY_LOOKUP = {
    "🔺": 0,
    "⏫": 1,
    "🔼": 2,
    "🔽": 4,
    "⏬": 5,
} as const satisfies Record<keyof PickByValue<typeof SYMBOL_PATH_LOOKUP, "priority">, number>;

const SYMBOL_REG_EXP = new RegExp(keysIn(SYMBOL_PATH_LOOKUP).map(escapeRegExp).join("|"), "g");
