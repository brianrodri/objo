import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";

import { parseTaskEmojiFormat } from "../obsidian-tasks";

describe(`${parseTaskEmojiFormat.name}`, () => {
    it.each([
        [{ description: "task text" }, " \t task text \t "],
        [{ priority: 0 }, "🔺"],
        [{ priority: 1 }, "⏫"],
        [{ priority: 2 }, "🔼"],
        [{ priority: 4 }, "🔽"],
        [{ priority: 5 }, "⏬"],
        [{ id: "due3rd", dependsOn: new Set(["due1st", "due2nd"]) }, "🆔 due3rd ⛔ due1st, due2nd"],
        [{ dates: { cancelled: DateTime.fromISO("2024-10-25") } }, "❌ 2024-10-25"],
        [{ dates: { created: DateTime.fromISO("2024-10-26") } }, "➕ 2024-10-26"],
        [{ dates: { done: DateTime.fromISO("2024-10-27") } }, "✅ 2024-10-27"],
        [{ dates: { due: DateTime.fromISO("2024-10-28") } }, "📅 2024-10-28"],
        [{ dates: { scheduled: DateTime.fromISO("2024-10-29") } }, "⏳ 2024-10-29"],
        [{ dates: { scheduled: DateTime.fromISO("2024-10-30") } }, "⏳ 2024-10-30"],
        [{ dates: { start: DateTime.fromISO("2024-10-31") } }, "🛫 2024-10-31"],
    ])("parses %j from input=%j", (taskPart, text) => {
        expect(parseTaskEmojiFormat(text)).toMatchObject(taskPart);
    });

    it("accepts empty text", () => {
        expect(() => parseTaskEmojiFormat("")).not.toThrow();
    });

    it("parses sequential fields", () => {
        expect(
            parseTaskEmojiFormat(`
                TODO! 🔺 🆔 do3rd ⛔ do1st, do2nd
                    ❌ 2024-10-25 ➕ 2024-10-26 ✅ 2024-10-27
                    📅 2024-10-28 ⏳ 2024-10-29 🛫 2024-10-30
            `),
        ).toEqual({
            description: "TODO!",
            priority: 0,
            id: "do3rd",
            dependsOn: new Set(["do1st", "do2nd"]),
            dates: {
                cancelled: DateTime.fromISO("2024-10-25"),
                created: DateTime.fromISO("2024-10-26"),
                done: DateTime.fromISO("2024-10-27"),
                due: DateTime.fromISO("2024-10-28"),
                scheduled: DateTime.fromISO("2024-10-29"),
                start: DateTime.fromISO("2024-10-30"),
            },
        });
    });
});
