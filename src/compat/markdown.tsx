import { Component, Keymap, MarkdownRenderer, MarkdownView, UserEvent, Workspace } from "obsidian";
import { useEffect, useRef } from "preact/compat";

import { useObjoContext } from "@/compat/pluginContext";

export interface MarkdownProps {
    md: string;
}

export function Markdown({ md }: MarkdownProps) {
    const elRef = useRef<HTMLDivElement>(null);
    const { file, plugin, view } = useObjoContext();

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;
        const component = new Component();
        const promise = MarkdownRenderer.render(plugin.app, md, el, file.path, component).then(() => {
            addLinkEvents(el, plugin.app.workspace, view, file.path);
        });
        return () => promise.finally(() => component.unload());
    }, [plugin, md, file.path, view]);

    return <div ref={elRef} />;
}

function addLinkEvents(containerEl: HTMLElement, workspace: Workspace, hoverParent: MarkdownView, filePath: string) {
    for (const targetEl of containerEl.querySelectorAll("a.internal-link")) {
        const href = targetEl.getAttr("href");
        if (!href) continue;
        targetEl.addEventListener("click", (event) => {
            workspace.openLinkText(href, filePath, Keymap.isModEvent(event as UserEvent));
        });
        targetEl.addEventListener("mouseover", (event) => {
            workspace.trigger("hover-link", {
                event,
                hoverParent,
                linktext: targetEl.textContent,
                source: hoverParent.getMode(),
                targetEl,
            });
        });
    }
}
