import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";

import { parseTaskEmojis } from "../obsidian-tasks";

const isoDateTime = DateTime.fromISO;

describe("Parsing task emojis", () => {
    it.each([
        [{ description: "task text" }, " \t task text \t "],
        [{ priority: 0 }, "🔺"],
        [{ priority: 1 }, "⏫"],
        [{ priority: 2 }, "🔼"],
        [{ priority: 4 }, "🔽"],
        [{ priority: 5 }, "⏬"],
        [{ recurrenceRule: "every day" }, "🔁 every day"],
        [{ id: "due3rd", dependsOn: new Set(["due1st", "due2nd"]) }, "🆔 due3rd ⛔ due1st, due2nd"],
        [{ times: { start: isoDateTime("09:00") } }, "09:00 do at 9am"],
        [{ times: { start: isoDateTime("09:00"), end: isoDateTime("10:00") } }, "09:00/10:00 do between 9am and 10am"],
        [{ dates: { cancelled: isoDateTime("2024-10-25") } }, "❌ 2024-10-25"],
        [{ dates: { created: isoDateTime("2024-10-26") } }, "➕ 2024-10-26"],
        [{ dates: { done: isoDateTime("2024-10-27") } }, "✅ 2024-10-27"],
        [{ dates: { due: isoDateTime("2024-10-28") } }, "📅 2024-10-28"],
        [{ dates: { scheduled: isoDateTime("2024-10-29") } }, "⏳ 2024-10-29"],
        [{ dates: { scheduled: isoDateTime("2024-10-30") } }, "⏳ 2024-10-30"],
        [{ dates: { start: isoDateTime("2024-10-31") } }, "🛫 2024-10-31"],
    ])("parses %j from input=%j", (taskPart, text) => {
        expect(parseTaskEmojis(text)).toMatchObject(taskPart);
    });

    it("accepts empty text", () => {
        expect(() => parseTaskEmojis("")).not.toThrow();
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
                cancelled: isoDateTime("2024-10-25"),
                created: isoDateTime("2024-10-26"),
                done: isoDateTime("2024-10-27"),
                due: isoDateTime("2024-10-28"),
                scheduled: isoDateTime("2024-10-29"),
                start: isoDateTime("2024-10-30"),
            },
            times: {
                start: isoDateTime("09:00"),
                end: isoDateTime("10:00"),
            },
        });
    });
});
