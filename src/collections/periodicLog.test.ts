import { DateTime, Interval } from "luxon";
import { TFile } from "obsidian";
import { describe, expect, test } from "vitest";

import { PeriodicLogConfig } from "@/types/settings";

import { resolvePeriodicLog } from "./periodicLog";

const DAILY_CONFIG_TEMPLATE: Omit<PeriodicLogConfig, "folder"> = {
    offset: 0,
    duration: { day: 1 },
    linkedFolders: [],
    fileNameDateFormat: "yyyy-LL-dd",
    unit: "day",
};

describe("PeriodicLog", () => {
    test("resolves daily log file", () => {
        const config: PeriodicLogConfig = { ...DAILY_CONFIG_TEMPLATE, folder: "Daily Logs" };
        const file = { parent: { path: "Daily Logs" }, basename: "2024-06-05" } as TFile;

        expect(resolvePeriodicLog(file, [config])).toEqual({
            type: "periodic-log",
            interval: Interval.after(DateTime.fromISO("2024-06-05"), { day: 1 }),
            ...config,
        });
    });

    test("resolves daily log file at vault's root", () => {
        const config: PeriodicLogConfig = { ...DAILY_CONFIG_TEMPLATE, folder: "/" };
        const file = { parent: null, basename: "2024-06-05" } as TFile;

        expect(resolvePeriodicLog(file, [config])).toEqual({
            type: "periodic-log",
            interval: Interval.after(DateTime.fromISO("2024-06-05"), { day: 1 }),
            ...config,
        });
    });

    test("resolves to null when parent is missing", () => {
        const config: PeriodicLogConfig = { ...DAILY_CONFIG_TEMPLATE, folder: "Daily Logs" };
        const file = { parent: null, basename: "2024-06-05" } as TFile;

        expect(resolvePeriodicLog(file, [config])).toBeNull();
    });

    test("resolves to null when filename is invalid", () => {
        const config: PeriodicLogConfig = { ...DAILY_CONFIG_TEMPLATE, folder: "Daily Logs" };
        const file = { parent: { path: "Daily Logs" }, basename: "Index" } as TFile;

        expect(resolvePeriodicLog(file, [config])).toBeNull();
    });

    test("resolves to null when no configs match", () => {
        const config: PeriodicLogConfig = { ...DAILY_CONFIG_TEMPLATE, folder: "Daily Logs" };
        const file = { parent: { path: "Logs/Daily" }, basename: "2024-06-05" } as TFile;

        expect(resolvePeriodicLog(file, [config])).toBeNull();
    });

    test("throws error when multiple configs match", () => {
        const config: PeriodicLogConfig = { ...DAILY_CONFIG_TEMPLATE, folder: "Daily Logs" };
        const file = { parent: { path: "Daily Logs" }, basename: "2024-06-05" } as TFile;

        expect(() => resolvePeriodicLog(file, [config, config])).toThrowError();
    });
});
