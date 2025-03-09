import { has, set } from "lodash";
import { DateTime } from "luxon";
import { DeepPartial } from "utility-types";

import { Task } from "@/model/task/schema";

import { SYMBOL_PATH_LOOKUP, SYMBOL_PRIORITY_LOOKUP, SYMBOL_REG_EXP } from "./obsidian-tasks.const";

/**
 * Parses {@link Task} metadata from a real markdown blob using Obsidian Task's emoji format.
 *
 * Here's an illustration:
 * ```
 * //                                                                      ( symbol & value )
 * "the text at the front is assumed to be a description. ❌ cancelled date ➕ creation date ✅ completed date"
 * //                                                    ( symbol & value  )                ( symbol & value  )
 *
 * { cancelled: "cancelled date", created: "creation date", done: "completed date" }
 * ```
 * @param text - the text of the task without its' markdown text.
 * @returns a {@link Task} with the parsed metadata.
 * @see {@link https://publish.obsidian.md/tasks/Reference/Task+Formats/Tasks+Emoji+Format}
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
