import { Duration } from "luxon";
import { App, Component, MarkdownRenderer } from "obsidian";
import { createElement, FunctionalComponent, JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { useDebounceCallback } from "usehooks-ts";

import { MARKDOWN_RENDER_DEBOUNCE_TIME } from "./renderer.const";

/**
 * Asynchronously renders the given markdown source code as Obsidian (the app) would.
 * Debounces values so that, ideally, renders have enough time to finish before being discarded for newer values.
 * @param props - configures how the markdown is rendered.
 * @returns component for asynchronously rendering the given markdown source code as Obsidian (the app) would.
 */
export const ObsidianMarkdown: FunctionalComponent<ObsidianMarkdownProps> = (props) => {
    const { app, component, markdown, sourcePath, tagName = "span", delay = MARKDOWN_RENDER_DEBOUNCE_TIME } = props;
    const elRef = useRef<HTMLElement>();
    const render = useDebounceCallback(MarkdownRenderer.render, delay.toMillis());

    useEffect(() => {
        const { current: el } = elRef;
        if (el) {
            render(app, markdown, el, sourcePath, component);
            return render.cancel;
        }
    }, [render, app, markdown, sourcePath, component]);

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
    delay?: Duration<true>;
}
