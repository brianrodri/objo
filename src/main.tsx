import { Dataview } from "@/lib/obsidian-dataview/adapter";
import { Plugin } from "@/lib/obsidian/types";

export class Objo extends Plugin {
    override onload() {
        this.app.workspace.onLayoutReady(async () => {
            const dv = await Dataview.getReady(this);
            this.log(dv);
            this.registerEvent(dv.on("dataview:metadata-change", () => this.log(dv)));
        });
    }

    private log(dv: Dataview): void {
        console.log(JSON.stringify(dv.getTasks("-#index"), null, 4));
    }
}

export default Objo;
