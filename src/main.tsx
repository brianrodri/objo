import { Plugin } from "@/lib/obsidian/types";

export class Objo extends Plugin {
    override onload() {
        this.app.workspace.onLayoutReady(() => console.log("started"));
    }
}

export default Objo;
