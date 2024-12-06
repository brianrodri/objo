export { DataviewApi, getAPI, isPluginEnabled } from "obsidian-dataview";
import { DateTime } from "luxon";
import type { SMarkdownPage, STask } from "obsidian-dataview/lib/data-model/serialized/markdown";

export type Page = SMarkdownPage;

export interface Task extends STask {
    created?: DateTime;
    due?: DateTime;
    completion?: DateTime;
    start?: DateTime;
    scheduled?: DateTime;
}