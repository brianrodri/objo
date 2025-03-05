import { DateTime } from "luxon";
import { DataArray } from "obsidian-dataview/lib/api/data-array";
import type { DataviewApi as ActualDataviewApi } from "obsidian-dataview/lib/api/plugin-api";
import type { SMarkdownPage, STask } from "obsidian-dataview/lib/data-model/serialized/markdown";

export { getAPI, isPluginEnabled } from "obsidian-dataview";

/** The obsidian-dataview interface for page metadata. */
export type DataviewMarkdownPage = SMarkdownPage;

/** The obsidian-dataview interface for task metadata. Adjusted to narrow the types of dates. */
export interface DataviewMarkdownTask extends STask {
    created?: DateTime;
    due?: DateTime;
    completion?: DateTime;
    start?: DateTime;
    scheduled?: DateTime;
}

/** The obsidian-dataview API used by plugins. Adjusted to narrow the type of dependencies. */
export interface DataviewApi extends ActualDataviewApi {
    pages(query: string): DataArray<SMarkdownPage>;
}
