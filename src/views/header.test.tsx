import { render as preactRender } from "@testing-library/preact";
import { DateTime, Interval } from "luxon";
import type { MarkdownView, Plugin, TFile } from "obsidian";
import { ComponentChild } from "preact";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { PeriodicLog } from "@/collections/periodicLog";
import { ObjoContext, ObjoContextProvider } from "@/compat/pluginContext";
import { Header } from "@/views/header";

describe("Header", () => {
    const plugin = {} as Plugin;
    const view = {} as MarkdownView;
    const file = {} as TFile;

    describe("for daily logs", () => {
        const DURATION = { day: 1 };
        const TODAY = DateTime.now().startOf("day");

        beforeEach(() => {
            vi.useFakeTimers().setSystemTime(TODAY.toJSDate());
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        const render = (el: ComponentChild, { interval }: Pick<PeriodicLog, "interval">) => {
            const context: ObjoContext = {
                collection: {
                    type: "periodic-log",
                    unit: "day",
                    duration: DURATION,
                    offset: 0,
                    fileNameDateFormat: "yyyy-MM-dd",
                    folder: "Daily Logs",
                    linkedFolders: [],
                    interval,
                },
                plugin,
                view,
                file,
            };
            return preactRender(<ObjoContextProvider value={context}>{el}</ObjoContextProvider>);
        };

        test("shows 'Today' when the interval contains now", () => {
            const result = render(<Header />, { interval: Interval.after(TODAY, DURATION) as Interval<true> });

            expect(result.container.textContent).toEqual("Today");
        });

        test("shows 'Yesterday' when the file's interval is for yesterday", () => {
            const interval = Interval.after(TODAY.minus(DURATION), DURATION) as Interval<true>;
            const result = render(<Header />, { interval });

            expect(result.container.textContent).toEqual("Yesterday");
        });

        test("shows 'Tomorrow' when the file's interval is for tomorrow", () => {
            const interval = Interval.after(TODAY.plus(DURATION), DURATION) as Interval<true>;
            const result = render(<Header />, { interval });

            expect(result.container.textContent).toEqual("Tomorrow");
        });

        test("shows full date when the file's interval is far in the past", () => {
            const interval = Interval.after(TODAY.minus({ year: 1 }), DURATION) as Interval<true>;
            const result = render(<Header />, { interval });

            expect(result.container.textContent).toEqual(interval.start.toFormat("yyyy-MM-dd"));
        });

        test("shows full date when the file's interval is far in the future", () => {
            const interval = Interval.after(TODAY.plus({ year: 1 }), DURATION) as Interval<true>;
            const result = render(<Header />, { interval });

            expect(result.container.textContent).toEqual(interval.start.toFormat("yyyy-MM-dd"));
        });
    });

    describe("for sprint logs", () => {
        // At my job, sprints begin on Thursdays and last for two weeks.
        const OFFSET = { days: 4 };
        const DURATION = { weeks: 2 };
        const SPRINT_START = DateTime.now().startOf("week").plus(OFFSET);

        beforeEach(() => {
            vi.useFakeTimers().setSystemTime(SPRINT_START.toJSDate());
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        const render = (el: ComponentChild, { interval }: Pick<PeriodicLog, "interval">) => {
            const context: ObjoContext = {
                collection: {
                    type: "periodic-log",
                    label: "sprint",
                    unit: "week",
                    duration: DURATION,
                    offset: OFFSET,
                    interval,
                    fileNameDateFormat: "kkkk-'W'WW",
                    folder: "Sprint Logs",
                },
                plugin,
                view,
                file,
            };
            return preactRender(<ObjoContextProvider value={context}>{el}</ObjoContextProvider>);
        };

        test("shows 'This sprint' when the interval contains now", () => {
            const result = render(<Header />, { interval: Interval.after(SPRINT_START, DURATION) as Interval<true> });

            expect(result.container.textContent).toEqual("This sprint");
        });

        test("shows 'Last sprint' when the file's interval is for the last sprint", () => {
            const interval = Interval.after(SPRINT_START.minus(DURATION), DURATION) as Interval<true>;
            const result = render(<Header />, { interval });

            expect(result.container.textContent).toEqual("Last sprint");
        });

        test("shows 'Next sprint' when the file's interval is for the next sprint", () => {
            const interval = Interval.after(SPRINT_START.plus(DURATION), DURATION) as Interval<true>;
            const result = render(<Header />, { interval });

            expect(result.container.textContent).toEqual("Next sprint");
        });

        test("shows full date when the file's interval is far in the past", () => {
            const interval = Interval.after(SPRINT_START.minus({ year: 1 }), DURATION) as Interval<true>;
            const result = render(<Header />, { interval });

            expect(result.container.textContent).toEqual(interval.start.toFormat("kkkk-'W'WW"));
        });

        test("shows full date when the file's interval is far in the future", () => {
            const interval = Interval.after(SPRINT_START.plus({ year: 1 }), DURATION) as Interval<true>;
            const result = render(<Header />, { interval });

            expect(result.container.textContent).toEqual(interval.start.toFormat("kkkk-'W'WW"));
        });
    });
});
