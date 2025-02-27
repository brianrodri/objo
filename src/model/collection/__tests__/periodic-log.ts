import { Duration, Interval } from "luxon";
import { describe, expect, it } from "vitest";

import { PeriodicLog } from "../periodic-log";

describe("PeriodicLog", () => {
    describe("pre-conditions", () => {
        it("should throw when id is empty", () => {
            expect(() => new PeriodicLog("", "/vault", "yyyy-MM-dd", { days: 1 })).toThrow();
        });

        it("should throw when folder is empty", () => {
            expect(() => new PeriodicLog("id", "", "yyyy-MM-dd", { days: 1 })).toThrow();
        });

        it("should throw when date format is empty", () => {
            expect(() => new PeriodicLog("id", "/vault", "", { days: 1 })).toThrow();
        });

        it("should throw when interval duration is invalid", () => {
            expect(() => new PeriodicLog("id", "/vault", "yyyy-MM-dd", Duration.invalid("!"))).toThrow();
        });

        it("should throw when interval offset is invalid", () => {
            expect(() => new PeriodicLog("id", "/vault", "yyyy-MM-dd", { days: 1 }, Duration.invalid("!"))).toThrow();
        });

        it("should throw when interval duration is 0", () => {
            expect(() => new PeriodicLog("id", "/vault", "yyyy-MM-dd", { days: 0 })).toThrow();
        });

        it.each([-1, +1])("should not throw when interval duration is %j", (days) => {
            expect(() => new PeriodicLog("id", "/vault", "yyyy-MM-dd", { days })).not.toThrow();
        });

        it.each([+1, 0, -1])("should not throw when interval offset is %j", (days) => {
            expect(() => new PeriodicLog("id", "/vault", "yyyy-MM-dd", { days: 1 }, { days })).not.toThrow();
        });
    });

    describe('given daily log in folder: "/vault"', () => {
        const log = new PeriodicLog("id", "/vault", "yyyy-MM-dd", { days: 1 });

        it('should include "/vault/2023-01-01.md"', () => {
            expect(log.includes("/vault/2023-01-01.md")).toBe(true);
        });

        it.each([["2023-01-01/2023-01-02", "/vault/2023-01-01.md"]])(
            "should return %j as the interval of %j",
            (isoInterval, filePath) => {
                expect(log.getIntervalOf(filePath)).toEqual(Interval.fromISO(isoInterval));
            },
        );

        it.each([
            "/vault/2023-01-99.md",
            "/vault/2023/01/99.md",
            "/vault/subfolder/2023-01-04.md",
            "/sprints/2023-01-05.md",
        ])("should not include %j", (filePath) => {
            expect(log.includes(filePath)).toBe(false);
        });
    });

    describe('given sprint logs starting every other thursday in folder: "/sprints"', () => {
        const log = new PeriodicLog("id", "/sprints", "kkkk-'W'WW", { weeks: 2 }, { days: 3 });

        it('should include "/sprints/2023-W37.md"', () => {
            expect(log.includes("/sprints/2023-W37.md")).toBe(true);
        });

        it.each([
            ["2023-09-14/2023-09-28", "/sprints/2023-W37.md"],
            ["2025-02-27/2025-03-13", "/sprints/2025-W09.md"],
        ])("should return %j as the interval of %j", (isoInterval, filePath) => {
            expect(log.getIntervalOf(filePath)).toEqual(Interval.fromISO(isoInterval));
        });

        it.each([
            "/sprints/2023-09-14.md",
            "/sprints/2023-W99.md",
            "/sprints/subfolder/2023-W37.md",
            "/vault/2023-W37.md",
        ])("should not include %j", (filePath) => {
            expect(log.includes(filePath)).toBe(false);
        });
    });
});
