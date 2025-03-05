import { escapeRegExp, has, keysIn, set } from "lodash";
import { DateTime } from "luxon";
import { DeepPartial, PickByValue } from "utility-types";

import { Task } from "@/model/task/schema";
import { PathsOf } from "@/util/type-utils";

/**
 * Parses {@link Task} metadata from a real markdown blob using Obsidian Task's emoji format.
 * @param text - the text of the task without its' markdown text.
 * @returns a {@link Task} with the parsed metadata.
 * @see {@link https://publish.obsidian.md/tasks/Reference/Task+Formats/Tasks+Emoji+Format}
 * @example
 *                                                                         ( symbol & value )
 * "the text at the front is assumed to be a description. ❌ cancelled date ➕ creation date ✅ completed date"
 *                                                       ( symbol & value )                 ( symbol & value  )
 *
 * \{ cancelled: "cancelled date", created: "creation date", done: "completed date" \}
 */
export function parseTaskEmojiFormat(text: string): DeepPartial<Task> {
    const matchedSymbols = [...text.matchAll(SYMBOL_REG_EXP), /$/.exec(text) as RegExpExecArray];
    const textBeforeAllSymbols = text.slice(0, matchedSymbols[0].index);

    const result: DeepPartial<Task> = { description: textBeforeAllSymbols.trim() };

    for (let i = 0; i <= matchedSymbols.length - 2; ++i) {
        const [execArray, nextExecArray] = matchedSymbols.slice(i, i + 2);

        const symbol = execArray[0];
        const symbolPath = SYMBOL_PATH_LOOKUP[symbol as keyof typeof SYMBOL_PATH_LOOKUP];
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
} as const satisfies Record<string, PathsOf<Task>>;

const SYMBOL_PRIORITY_LOOKUP = {
    "🔺": 0,
    "⏫": 1,
    "🔼": 2,
    "🔽": 4,
    "⏬": 5,
} as const satisfies { [K in keyof PickByValue<typeof SYMBOL_PATH_LOOKUP, "priority">]: number };

const SYMBOL_REG_EXP = new RegExp(keysIn(SYMBOL_PATH_LOOKUP).map(escapeRegExp).join("|"), "g");
