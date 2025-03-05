import { Plugin } from "@/lib/obsidian/types";

/** Entry point for the plugin. Obsidian depends on this class to define all lifecycle events and rendering behavior. */
export class Objo extends Plugin {
    /** Called by Obsidian to give the plugin an opportunity to "load" and hook into the ecosystem. */
    override onload() {
        this.app.workspace.onLayoutReady(() => console.log("loaded"));
    }
}

export default Objo;
