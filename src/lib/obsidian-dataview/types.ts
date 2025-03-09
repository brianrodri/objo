import { DateTime } from "luxon";
import type { DataArray } from "obsidian-dataview/lib/api/data-array";
import type { DataviewApi as ActualDataviewApi } from "obsidian-dataview/lib/api/plugin-api";
import type { SMarkdownPage, STask } from "obsidian-dataview/lib/data-model/serialized/markdown";
import type { Link as ActualLink } from "obsidian-dataview/lib/data-model/value";

export { getAPI, isPluginEnabled } from "obsidian-dataview";

/** The API that the obsidian-dataview plugin exposes to plugin authors. Extended to improve type information. */
export declare class DataviewApi extends ActualDataviewApi {
    override pages(query: string): DataArray<SMarkdownPage>;
}

/** The metadata that the obsidian-dataview plugin extracts from tasks. Extended to improve type information. */
export interface DataviewMarkdownTask extends STask {
    created?: DateTime;
    due?: DateTime;
    completion?: DateTime;
    start?: DateTime;
    scheduled?: DateTime;
    section: ActualLink;
}

/** The Obsidian 'link', used for uniquely describing a file, header, or block. Extended to improve type information. */
export type Link = ActualLink;
