import { DateTime } from "luxon";
import type { STask } from "obsidian-dataview/lib/data-model/serialized/markdown";

export { DataviewApi, getAPI, isPluginEnabled } from "obsidian-dataview";
export type { SMarkdownPage as DataviewMarkdownPage } from "obsidian-dataview/lib/data-model/serialized/markdown";

export interface DataviewMarkdownTask extends STask {
    created?: DateTime;
    due?: DateTime;
    completion?: DateTime;
    start?: DateTime;
    scheduled?: DateTime;
}
