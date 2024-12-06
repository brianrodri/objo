export { DataviewApi, getAPI, isPluginEnabled } from "obsidian-dataview";
export type { SMarkdownPage } from "obsidian-dataview/lib/data-model/serialized/markdown";

import { DateTime } from "luxon";
import type { STask as STaskActual } from "obsidian-dataview/lib/data-model/serialized/markdown";

export interface STask extends STaskActual {
    created?: DateTime;
    due?: DateTime;
    completion?: DateTime;
    start?: DateTime;
    scheduled?: DateTime;
}
