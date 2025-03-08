import { Duration, DurationLike, Interval } from "luxon";
import { describe, expect, it } from "vitest";

import { PeriodicNotes, PeriodicNotesConfig } from "../periodic-notes";

describe(`${PeriodicNotes.name}`, () => {
    const required: PeriodicNotesConfig<false> = {
        folder: "/vault",
        dateFormat: "yyyy-MM-dd",
        intervalDuration: { days: 1 },
    };

    describe("pre-conditions", () => {
        it("should throw when folder is empty", () => {
            const folder = "";
            expect(() => new PeriodicNotes({ ...required, folder })).toThrowErrorMatchingSnapshot();
        });

        it("should throw when date format is empty", () => {
            const dateFormat = "";
            expect(() => new PeriodicNotes({ ...required, dateFormat })).toThrowErrorMatchingSnapshot();
        });

        it("should throw when interval duration is invalid", () => {
            const intervalDuration = { days: "one" } as unknown as DurationLike;
            expect(() => new PeriodicNotes({ ...required, intervalDuration })).toThrowErrorMatchingSnapshot();
        });

        it("should throw when interval offset is invalid", () => {
            const intervalOffset = { days: "one" } as unknown as DurationLike;
            expect(() => new PeriodicNotes({ ...required, intervalOffset })).toThrowErrorMatchingSnapshot();
        });

        it("should throw when interval duration is 0", () => {
            const intervalDuration = 0;
            expect(() => new PeriodicNotes({ ...required, intervalDuration })).toThrowErrorMatchingSnapshot();
        });

        it("should throw when everything is invalid", () => {
            const invalidConfig = {
                folder: "",
                dateFormat: "",
                intervalDuration: Duration.invalid("!"),
                intervalOffset: Duration.invalid("invalid time", "unspecified"),
            };
            expect(() => new PeriodicNotes(invalidConfig)).toThrowErrorMatchingSnapshot();
        });

        it.each([+1, 0, -1])("should not throw when interval offset is %j", (intervalOffset) => {
            expect(() => new PeriodicNotes({ ...required, intervalOffset })).not.toThrow();
        });

        it.each([+1, -1])("should not throw when interval duration is %j", (intervalDuration) => {
            expect(() => new PeriodicNotes({ ...required, intervalDuration })).not.toThrow();
        });
    });

    describe("post-conditions", () => {
        it("should strip trailing slashes from the folder", () => {
            expect(new PeriodicNotes({ ...required, folder: "/vault" }).folder).toEqual("/vault");
        });
    });

    describe('given daily log in folder: "/vault"', () => {
        const log = new PeriodicNotes({
            folder: "/vault",
            dateFormat: "yyyy-MM-dd",
            intervalDuration: { days: 1 },
        });

        it.each(["/vault/2023-01-01.md"])("should include %j", (filePath) => {
            expect(log.includes(filePath)).toBe(true);
        });

        it.each([
            "/vault/2023-01-99.md",
            "/vault/2023/01/99.md",
            "/vault/subfolder/2023-01-04.md",
            "/sprints/2023-01-05.md",
        ])("should not include %j", (filePath) => {
            expect(log.includes(filePath)).toBe(false);
        });

        it.each([
            ["2023-01-01/2023-01-02", "/vault/2023-01-01.md"],
            ["2025-02-28/2025-03-01", "/vault/2025-02-28.md"],
        ])("should return %j as the interval of %j", (isoInterval, filePath) => {
            expect(log.getIntervalOf(filePath)).toEqual(Interval.fromISO(isoInterval));
        });
    });

    describe('given sprint logs starting every other thursday in folder: "/sprints"', () => {
        const log = new PeriodicNotes({
            folder: "/sprints",
            dateFormat: "kkkk-'W'WW",
            intervalDuration: { weeks: 2 },
            intervalOffset: { days: 3 },
        });

        it.each(["/sprints/2023-W37.md"])("should include %j", (filePath) => {
            expect(log.includes(filePath)).toBe(true);
        });

        it.each([
            "/sprints/2023-09-14.md",
            "/sprints/2023-W99.md",
            "/sprints/subfolder/2023-W37.md",
            "/vault/2023-W37.md",
        ])("should not include %j", (filePath) => {
            expect(log.includes(filePath)).toBe(false);
        });

        it.each([
            ["2023-09-14/2023-09-28", "/sprints/2023-W37.md"],
            ["2025-02-27/2025-03-13", "/sprints/2025-W09.md"],
        ])("should return %j as the interval of %j", (isoInterval, filePath) => {
            expect(log.getIntervalOf(filePath)).toEqual(Interval.fromISO(isoInterval));
        });
    });
});
