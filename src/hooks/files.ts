import { getAPI } from "obsidian-dataview";

export function useFiles(folder: string) {
    // TODO: Should I memoize this somehow?
    return getAPI().pages(`"${folder}"`);
}
