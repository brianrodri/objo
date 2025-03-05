import { render, waitFor } from "@testing-library/preact";
import { Duration } from "luxon";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { App, Component, MarkdownRenderer } from "@/lib/obsidian/types";

import { ObsidianMarkdown, ObsidianMarkdownProps } from "../obsidian";

vi.mock("@/lib/obsidian/types");

describe(`${ObsidianMarkdown.name}`, () => {
    const app = new App();
    const component = new Component();
    const markdown = "Hello World";
    const sourcePath = "/vault/diary.md";
    const tagName = "span";
    const delay = Duration.fromMillis(500);

    beforeAll(() => vi.useFakeTimers());
    afterEach(() => vi.resetAllMocks());
    afterAll(() => vi.useRealTimers());

    it("should invoke render with the provided props", async () => {
        const props: ObsidianMarkdownProps = { app, component, markdown, sourcePath, tagName, delay };

        render(<ObsidianMarkdown {...props} />);

        await vi.runAllTimersAsync();

        await waitFor(() =>
            expect(MarkdownRenderer.render).toHaveBeenCalledWith(
                app,
                markdown,
                expect.any(HTMLSpanElement),
                sourcePath,
                component,
            ),
        );
    });

    it("should rerender after a delay when the markdown value changes", async () => {
        const delay = Duration.fromMillis(300);
        const props: ObsidianMarkdownProps = { markdown: "Hello, World!", app, component, sourcePath, tagName, delay };

        const { rerender } = render(<ObsidianMarkdown {...props} />);
        await vi.runAllTimersAsync();

        expect(MarkdownRenderer.render).toHaveBeenCalledTimes(1);

        rerender(<ObsidianMarkdown {...{ ...props, markdown: "Hello, Planet" }} />);
        await vi.advanceTimersByTimeAsync(299);

        expect(MarkdownRenderer.render).toHaveBeenCalledTimes(1);

        rerender(<ObsidianMarkdown {...{ ...props, markdown: "Hello, Planet" }} />);
        await vi.advanceTimersByTimeAsync(1);

        expect(MarkdownRenderer.render).toHaveBeenCalledTimes(2);
    });
});
