import { Component } from "obsidian";
import { ReactElement, render, unmountComponentAtNode } from "preact/compat";

export class PreactComponent extends Component {
    public constructor(
        public readonly filePath: string,
        private readonly preactEl: ReactElement,
        private readonly viewContainerEl: HTMLElement,
        private readonly rootElContainerSelector = ".markdown-reading-view > .markdown-preview-view",
        private readonly rootElClass = "OBJO-ROOT-CLASS",
    ) {
        super();
    }

    public override onload() {
        const rootContainerEl = this.viewContainerEl.querySelector(this.rootElContainerSelector);
        if (!rootContainerEl) return;
        const rootEl = rootContainerEl.createDiv({ cls: this.rootElClass });
        render(this.preactEl, rootEl);
        rootContainerEl.prepend(rootEl);
    }

    public override onunload() {
        const rootEl = this.viewContainerEl.querySelector(`.${this.rootElClass}`);
        if (!rootEl) return;
        unmountComponentAtNode(rootEl);
        rootEl.remove();
    }
}
