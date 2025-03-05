import { DateTime } from "luxon";
import { DataArray } from "obsidian-dataview/lib/api/data-array";
import type { DataviewApi as ActualDataviewApi } from "obsidian-dataview/lib/api/plugin-api";
import type { SMarkdownPage, STask } from "obsidian-dataview/lib/data-model/serialized/markdown";

export { getAPI, isPluginEnabled } from "obsidian-dataview";

/** Metadata the obsidian-dataview plugin tracks from notes. */
export type DataviewMarkdownPage = SMarkdownPage;

/** Metadata the obsidian-dataview plugin tracks from tasks. Extended to improve type information. */
export interface DataviewMarkdownTask extends STask {
    created?: DateTime;
    due?: DateTime;
    completion?: DateTime;
    start?: DateTime;
    scheduled?: DateTime;
}

/** API the obsidian-dataview plugin exposes to plugin authors. Extended to improve type information. */
export interface DataviewApi extends ActualDataviewApi {
    pages(query: string): DataArray<SMarkdownPage>;
}
