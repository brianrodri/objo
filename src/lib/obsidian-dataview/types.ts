import { DateTime } from "luxon";
import { DataArray } from "obsidian-dataview/lib/api/data-array";
import type { DataviewApi as ActualDataviewApi } from "obsidian-dataview/lib/api/plugin-api";
import type { SMarkdownPage, STask } from "obsidian-dataview/lib/data-model/serialized/markdown";

export { getAPI, isPluginEnabled } from "obsidian-dataview";

/** The obsidian-dataview interface for metadata about markdown files. */
export type DataviewMarkdownPage = SMarkdownPage;

/** The obsidian-dataview interface for metadata about markdown tasks. Adjusted to narrow types. */
export interface DataviewMarkdownTask extends STask {
    created?: DateTime;
    due?: DateTime;
    completion?: DateTime;
    start?: DateTime;
    scheduled?: DateTime;
}

/** The obsidian-dataview API used by Objo. Adjusted to narrow types. */
export interface DataviewApi extends ActualDataviewApi {
    pages(query: string): DataArray<SMarkdownPage>;
}
