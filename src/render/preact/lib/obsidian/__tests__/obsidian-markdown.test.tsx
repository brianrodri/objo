import { render } from "@testing-library/preact";
import { DurationLike } from "luxon";
import { OmitByValue } from "utility-types";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { App, Component, MarkdownRenderer } from "@/lib/obsidian/types";

import { ObsidianMarkdown, ObsidianMarkdownProps } from "../obsidian-markdown";

vi.mock("@/lib/obsidian/types");
afterEach(() => vi.restoreAllMocks());

describe(`${ObsidianMarkdown.name}`, () => {
    const requiredProps: OmitByValue<ObsidianMarkdownProps, undefined> = {
        app: new App(),
        component: new Component(),
        sourcePath: "/vault/diary.md",
        markdown: "Foo",
    };

    beforeAll(() => vi.useFakeTimers());
    afterAll(() => vi.useRealTimers());

    it("should render eventually", async () => {
        render(<ObsidianMarkdown {...requiredProps} />);
        expect(MarkdownRenderer["render"]).not.toHaveBeenCalled();
        await vi.runAllTimersAsync();
        expect(MarkdownRenderer["render"]).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when 'props.delay' is invalid", () => {
        const invalid = "one hour" as DurationLike;
        expect(() => render(<ObsidianMarkdown {...requiredProps} delay={invalid} />)).toThrowErrorMatchingSnapshot();
    });

    it("should rerender when 'props.markdown' stops changing for a while", async () => {
        const { rerender } = render(<ObsidianMarkdown {...requiredProps} delay={500} markdown="Apple" />);
        await vi.runAllTimersAsync();
        rerender(<ObsidianMarkdown {...requiredProps} delay={500} markdown="Banana" />);
        await vi.advanceTimersByTimeAsync(300);
        rerender(<ObsidianMarkdown {...requiredProps} delay={500} markdown="Banana" />);
        await vi.advanceTimersByTimeAsync(300);

        expect(MarkdownRenderer["render"]).toHaveBeenCalledTimes(2);
        expect(MarkdownRenderer["render"]).toHaveBeenCalledWith(
            requiredProps.app,
            "Apple",
            expect.any(HTMLSpanElement),
            requiredProps.sourcePath,
            requiredProps.component,
        );
        expect(MarkdownRenderer["render"]).toHaveBeenCalledWith(
            requiredProps.app,
            "Banana",
            expect.any(HTMLSpanElement),
            requiredProps.sourcePath,
            requiredProps.component,
        );
    });

    it("should not rerender when 'props.markdown' keeps changing", async () => {
        const { rerender } = render(<ObsidianMarkdown {...requiredProps} delay={500} markdown="Apple" />);
        await vi.runAllTimersAsync();
        rerender(<ObsidianMarkdown {...requiredProps} delay={500} markdown="Banana" />);
        await vi.advanceTimersByTimeAsync(300);
        rerender(<ObsidianMarkdown {...requiredProps} delay={500} markdown="Cherry" />);
        await vi.advanceTimersByTimeAsync(300);

        expect(MarkdownRenderer["render"]).toHaveBeenCalledTimes(1);
        expect(MarkdownRenderer["render"]).toHaveBeenCalledWith(
            requiredProps.app,
            "Apple",
            expect.any(HTMLSpanElement),
            requiredProps.sourcePath,
            requiredProps.component,
        );
        expect(MarkdownRenderer["render"]).not.toHaveBeenCalledWith(
            requiredProps.app,
            "Banana",
            expect.any(HTMLSpanElement),
            requiredProps.sourcePath,
            requiredProps.component,
        );
        expect(MarkdownRenderer["render"]).not.toHaveBeenCalledWith(
            requiredProps.app,
            "Cherry",
            expect.any(HTMLSpanElement),
            requiredProps.sourcePath,
            requiredProps.component,
        );
    });
});
