import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { parseTaskEmojis } from "../parse-task-emojis";

describe("Parsing task emojis", () => {
    it.each([
        [{ description: "task text" }, " \t task text \t "],
        [{ times: { start: DateTime.fromISO("09:00") } }, "09:00 do at 9am"],
        [
            { times: { start: DateTime.fromISO("09:00"), end: DateTime.fromISO("10:00") } },
            "09:00/10:00 do between 9am and 10am",
        ],
        [{ priority: 0 }, "🔺"],
        [{ priority: 1 }, "⏫"],
        [{ priority: 2 }, "🔼"],
        [{ priority: 4 }, "🔽"],
        [{ priority: 5 }, "⏬"],
        [{ recurrenceRule: "every day" }, "🔁 every day"],
        [{ id: "do3rd", dependsOn: new Set(["do1st", "do2nd"]) }, "🆔 do3rd ⛔ do1st, do2nd"],
        [{ dates: { cancelled: DateTime.fromISO("2024-10-25") } }, "❌ 2024-10-25"],
        [{ dates: { created: DateTime.fromISO("2024-10-26") } }, "➕ 2024-10-26"],
        [{ dates: { done: DateTime.fromISO("2024-10-27") } }, "✅ 2024-10-27"],
        [{ dates: { due: DateTime.fromISO("2024-10-28") } }, "📅 2024-10-28"],
        [{ dates: { scheduled: DateTime.fromISO("2024-10-29") } }, "⏳ 2024-10-29"],
        [{ dates: { scheduled: DateTime.fromISO("2024-10-30") } }, "⏳ 2024-10-30"],
        [{ dates: { start: DateTime.fromISO("2024-10-31") } }, "🛫 2024-10-31"],
    ])("parses %j from input=%j", (taskParts, text) => {
        expect(parseTaskEmojis(text)).toEqual(expect.objectContaining(taskParts));
    });

    it("parses sequential fields", () => {
        expect(
            parseTaskEmojis(`
                09:00/10:00 TODO! 🔺 🔁 every day 🆔 do3rd ⛔ do1st, do2nd
                    ❌ 2024-10-25 ➕ 2024-10-26 ✅ 2024-10-27
                    📅 2024-10-28 ⏳ 2024-10-29 🛫 2024-10-30
            `),
        ).toEqual({
            description: "TODO!",
            priority: 0,
            recurrenceRule: "every day",
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
            times: {
                start: DateTime.fromISO("09:00"),
                end: DateTime.fromISO("10:00"),
            },
        });
    });
});
