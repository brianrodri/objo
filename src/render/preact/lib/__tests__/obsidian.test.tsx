import { render } from "@testing-library/preact";
import { Duration } from "luxon";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { App, Component, MarkdownRenderer } from "@/lib/obsidian/types";

import { ObsidianMarkdown } from "../obsidian";

vi.mock("@/lib/obsidian/types");
afterEach(() => vi.restoreAllMocks());

describe(`${ObsidianMarkdown.name}`, () => {
    beforeAll(() => vi.useFakeTimers());
    afterAll(() => vi.useRealTimers());

    it("should rerender when markdown changes stay stable for a while", async () => {
        const props = {
            app: new App(),
            component: new Component(),
            sourcePath: "/vault/diary.md",
            delay: Duration.fromMillis(500),
        } as const;

        const { rerender } = render(<ObsidianMarkdown {...props} markdown="Apple" />);
        await vi.runAllTimersAsync();
        rerender(<ObsidianMarkdown {...props} markdown="Banana" />);
        await vi.advanceTimersByTimeAsync(300);
        rerender(<ObsidianMarkdown {...props} markdown="Banana" />);
        await vi.advanceTimersByTimeAsync(300);

        const anySpanElement = expect.any(HTMLSpanElement);
        expect(MarkdownRenderer.render).toHaveBeenCalledTimes(2);
        expect(MarkdownRenderer.render).toHaveBeenCalledWith(
            props.app,
            "Apple",
            anySpanElement,
            props.sourcePath,
            props.component,
        );
        expect(MarkdownRenderer.render).toHaveBeenCalledWith(
            props.app,
            "Banana",
            anySpanElement,
            props.sourcePath,
            props.component,
        );
    });

    it("should not rerender when markdown changes too frequently", async () => {
        const props = {
            app: new App(),
            component: new Component(),
            sourcePath: "/vault/diary.md",
            delay: Duration.fromMillis(500),
        } as const;

        const { rerender } = render(<ObsidianMarkdown {...props} markdown="Apple" />);
        await vi.runAllTimersAsync();
        rerender(<ObsidianMarkdown {...props} markdown="Banana" />);
        await vi.advanceTimersByTimeAsync(300);
        rerender(<ObsidianMarkdown {...props} markdown="Cherry" />);
        await vi.advanceTimersByTimeAsync(300);

        const anySpanElement = expect.any(HTMLSpanElement);
        expect(MarkdownRenderer.render).toHaveBeenCalledTimes(1);
        expect(MarkdownRenderer.render).toHaveBeenCalledWith(
            props.app,
            "Apple",
            anySpanElement,
            props.sourcePath,
            props.component,
        );
        expect(MarkdownRenderer.render).not.toHaveBeenCalledWith(
            props.app,
            "Banana",
            anySpanElement,
            props.sourcePath,
            props.component,
        );
        expect(MarkdownRenderer.render).not.toHaveBeenCalledWith(
            props.app,
            "Cherry",
            anySpanElement,
            props.sourcePath,
            props.component,
        );
    });
});
