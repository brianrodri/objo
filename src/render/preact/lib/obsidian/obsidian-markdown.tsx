import { Duration, DurationLike } from "luxon";
import { createElement, FunctionalComponent, JSX } from "preact";
import { useEffect, useMemo, useRef } from "preact/hooks";
import { useDebounceCallback } from "usehooks-ts";

import { App, Component, MarkdownRenderer } from "@/lib/obsidian/types";

import { MARKDOWN_RENDER_DEBOUNCE_TIME } from "./obsidian-markdown.const";

/**
 * @param props - props for the component.
 * @returns component that asynchronously renders the given markdown source code just as Obsidian (the app) would.
 */
export const ObsidianMarkdown: FunctionalComponent<ObsidianMarkdownProps> = (props) => {
    const { app, component, markdown, sourcePath, tagName = "span", delay = MARKDOWN_RENDER_DEBOUNCE_TIME } = props;
    const delayMs = useMemo(() => Duration.fromDurationLike(delay).toMillis(), [delay]);
    const renderObsidianMarkdown = useDebounceCallback(MarkdownRenderer["render"], delayMs);
    const elRef = useRef<HTMLElement>();

    useEffect(() => {
        const el = elRef.current;
        if (el) {
            const runAsync = async () => await renderObsidianMarkdown(app, markdown, el, sourcePath, component);
            runAsync().catch(console.error);
            return renderObsidianMarkdown.cancel;
        }
    }, [renderObsidianMarkdown, app, markdown, sourcePath, component]);

    return createElement(tagName, { ref: elRef });
};

/** Configures how Obsidian (the app) will render its markdown. */
export interface ObsidianMarkdownProps {
    /** A reference to the Obsidian app object. */
    app: App;
    /** A parent component to manage the lifecycle of the rendered child components. */
    component: Component;
    /** The Markdown source code. */
    markdown: string;
    /** The normalized path of this Markdown file, used to resolve relative internal links. */
    sourcePath: string;
    /** The tag used to contain the rendered Markdown source code. */
    tagName?: keyof JSX.IntrinsicElements;
    /** Custom debounce time for renders. */
    delay?: DurationLike;
}
