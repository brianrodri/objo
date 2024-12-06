import { Plugin } from "@/lib/obsidian/types";
import { Dataview } from "@/lib/obsidian-dataview/adapter";

export class Objo extends Plugin {
    override onload() {
        this.app.workspace.onLayoutReady(async () => {
            const dv = await Dataview.getReady(this);
            console.log(JSON.stringify(dv.getTasks("-#index")));
        });
    }
}

export default Objo;
