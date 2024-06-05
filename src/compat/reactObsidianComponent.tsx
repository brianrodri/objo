import { Component } from "obsidian";
import { ReactElement, render, unmountComponentAtNode } from "preact/compat";

export class ReactObsidianComponent extends Component {
    private readonly rootConfig: { cls: string[] };

    public constructor(
        private readonly reactElement: ReactElement,
        private readonly viewContainer: HTMLElement,
        private readonly rootContainerSelector = ".markdown-reading-view > .markdown-preview-view",
        private readonly rootIdentifier = "OBJO-ROOT-CLASS",
        rootClasses = ["markdown-preview-sizer"],
    ) {
        super();
        this.rootConfig = { cls: [this.rootIdentifier, ...rootClasses] };
    }

    public override onload() {
        const rootContainer = this.viewContainer.querySelector(this.rootContainerSelector);
        if (rootContainer) {
            const root = this.viewContainer.createDiv(this.rootConfig);
            rootContainer.prepend(root);
            render(this.reactElement, root);
        }
    }

    public override onunload() {
        const root = this.viewContainer.querySelector(`.${this.rootIdentifier}`);
        if (root) {
            unmountComponentAtNode(root);
            root.remove();
        }
    }
}
