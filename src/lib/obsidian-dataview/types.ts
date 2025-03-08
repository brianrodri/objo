import { DateTime } from "luxon";
import { DataArray } from "obsidian-dataview/lib/api/data-array";
import type { DataviewApi as ActualDataviewApi } from "obsidian-dataview/lib/api/plugin-api";
import type { SMarkdownPage, STask } from "obsidian-dataview/lib/data-model/serialized/markdown";
import type { Link as DataviewLink } from "obsidian-dataview/lib/data-model/value";

export { getAPI, isPluginEnabled } from "obsidian-dataview";

/** The Obsidian 'link', used for uniquely describing a file, header, or block. Extended to improve type information. */
export type Link = DataviewLink;

/** The metadata that the obsidian-dataview plugin extracts from tasks. Extended to improve type information. */
export interface DataviewMarkdownTask extends STask {
    created?: DateTime;
    due?: DateTime;
    completion?: DateTime;
    start?: DateTime;
    scheduled?: DateTime;
    section: Link;
}

/** The API that the obsidian-dataview plugin exposes to plugin authors. Extended to improve type information. */
export interface DataviewApi extends ActualDataviewApi {
    pages(query: string): DataArray<SMarkdownPage>;
}
