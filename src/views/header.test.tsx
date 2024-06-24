import { render as preactRender } from "@testing-library/preact";
import { DateTime, Interval } from "luxon";
import type { MarkdownView, Plugin, TFile } from "obsidian";
import { ComponentChild } from "preact";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";

import { SAMPLE_DAILY_LOG, SAMPLE_SPRINT_LOG } from "@/collections/periodicLog";
import { ObjoContextProvider } from "@/compat/pluginContext";
import { Header } from "@/views/header";

const ONE_DAY = { day: 1 } as const;
const TWO_WEEKS = { weeks: 2 } as const;

describe("Header", () => {
    const plugin = {} as Plugin;
    const view = {} as MarkdownView;
    const file = {} as TFile;

    describe("for daily logs", () => {
        const TODAY = DateTime.fromISO("2024-06-23");

        const render = (el: ComponentChild, interval: Interval) => {
            const value = { plugin, view, file, collection: { ...SAMPLE_DAILY_LOG, interval } } as const;
            return preactRender(<ObjoContextProvider value={value}>{el}</ObjoContextProvider>);
        };

        beforeAll(() => {
            vi.useFakeTimers().setSystemTime(TODAY.toJSDate());
        });

        afterAll(() => {
            vi.useRealTimers();
        });

        test("shows 'Today' when the interval contains now", () => {
            const result = render(<Header />, Interval.after(TODAY, ONE_DAY));

            expect(result.container.textContent).toEqual("Today");
        });

        test("shows 'Yesterday' when the file's interval is for yesterday", () => {
            const interval = Interval.after(TODAY.minus(ONE_DAY), ONE_DAY);
            const result = render(<Header />, interval);

            expect(result.container.textContent).toEqual("Yesterday");
        });

        test("shows 'Tomorrow' when the file's interval is for tomorrow", () => {
            const interval = Interval.after(TODAY.plus(ONE_DAY), ONE_DAY);
            const result = render(<Header />, interval);

            expect(result.container.textContent).toEqual("Tomorrow");
        });

        test("shows full date when the file's interval is far in the past", () => {
            const interval = Interval.after(TODAY.minus({ year: 1 }), ONE_DAY);
            const result = render(<Header />, interval);

            expect(result.container.textContent).toEqual("Friday June 23, 2023");
        });

        test("shows full date when the file's interval is far in the future", () => {
            const interval = Interval.after(TODAY.plus({ year: 1 }), ONE_DAY);
            const result = render(<Header />, interval);

            expect(result.container.textContent).toEqual("Monday June 23, 2025");
        });
    });

    describe("for sprint logs", () => {
        // At my job, sprints begin on Thursdays and last for two weeks. 2024-06-20 is a Thursday.
        const SPRINT_START = DateTime.fromISO("2024-06-20");

        const render = (el: ComponentChild, interval: Interval) => {
            const value = { plugin, view, file, collection: { ...SAMPLE_SPRINT_LOG, interval } } as const;
            return preactRender(<ObjoContextProvider value={value}>{el}</ObjoContextProvider>);
        };

        beforeAll(() => {
            vi.useFakeTimers().setSystemTime(SPRINT_START.toJSDate());
        });

        afterAll(() => {
            vi.useRealTimers();
        });

        test("shows 'This sprint' when the interval contains now", () => {
            const result = render(<Header />, Interval.after(SPRINT_START, TWO_WEEKS));

            expect(result.container.textContent).toEqual("This sprint");
        });

        test("shows 'Last sprint' when the file's interval is for the last sprint", () => {
            const interval = Interval.after(SPRINT_START.minus(TWO_WEEKS), TWO_WEEKS);
            const result = render(<Header />, interval);

            expect(result.container.textContent).toEqual("Last sprint");
        });

        test("shows 'Next sprint' when the file's interval is for the next sprint", () => {
            const interval = Interval.after(SPRINT_START.plus(TWO_WEEKS), TWO_WEEKS);
            const result = render(<Header />, interval);

            expect(result.container.textContent).toEqual("Next sprint");
        });

        test("shows full date when the file's interval is far in the past", () => {
            const interval = Interval.after(SPRINT_START.minus({ year: 1 }), TWO_WEEKS);
            const result = render(<Header />, interval);

            expect(result.container.textContent).toEqual("2023-W25");
        });

        test("shows full date when the file's interval is far in the future", () => {
            const interval = Interval.after(SPRINT_START.plus({ year: 1 }), TWO_WEEKS);
            const result = render(<Header />, interval);

            expect(result.container.textContent).toEqual("2025-W25");
        });
    });
});
