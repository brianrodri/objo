import { render } from "preact";

import { Plugin } from "@/lib/obsidian/types";
import { ObsidianMarkdown } from "@/render/preact/lib/obsidian/obsidian-markdown";

/** Entry point for the plugin. Obsidian depends on this class to define all lifecycle events and rendering behavior. */
export class Objo extends Plugin {
    /** Called by Obsidian to give the plugin an opportunity to "load" and hook into the ecosystem. */
    override onload() {
        this.app.workspace.onLayoutReady(() => console.log("loaded"));

        this.registerMarkdownCodeBlockProcessor("objo", (source, el, ctx) => {
            render(
                <ObsidianMarkdown markdown={source} app={this.app} component={this} sourcePath={ctx.sourcePath} />,
                el,
            );
        });
    }
}

export default Objo;
