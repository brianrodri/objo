import { has, set } from "lodash";
import { DateTime } from "luxon";
import { DeepPartial } from "utility-types";

import { Task } from "@/model/task/schema";

import { SYMBOL_PATH_LOOKUP, SYMBOL_PRIORITY_LOOKUP, SYMBOL_REG_EXP } from "./obsidian-tasks.const";

/**
 * Parses task metadata from a markdown string using Obsidian Task's emoji format.
 *
 * The function extracts the task description (the text preceding the first emoji symbol) and associated metadata.
 * Recognized emoji markers denote fields such as cancellation, creation, completion dates, priority, or dependencies.
 *
 * For example:
 * ```
 * "Prepare slides ❌ 2025-05-01 ➕ 2025-04-20 ✅ 2025-05-05"
 * // Returns an object similar to:
 * // {
 * //   description: "Prepare slides",
 * //   cancelled: DateTime for "2025-05-01",
 * //   created: DateTime for "2025-04-20",
 * //   done: DateTime for "2025-05-05"
 * // }
 * ```
 * @param text - The markdown text containing the task description and metadata formatted with Obsidian Task's emoji syntax.
 * @returns A partial {@link Task} object populated with the extracted metadata.
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
