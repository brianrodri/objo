import { sortBy, sortedIndexBy } from "lodash";
import { DateTime } from "luxon";
import type { TFile } from "obsidian";
import { getAPI } from "obsidian-dataview";
import type { SMarkdownPage } from "obsidian-dataview/lib/data-model/serialized/markdown";

import { Markdown } from "@/compat/markdown";
import { useObjoContext } from "@/compat/pluginContext";

type SMarkdownPageFile = SMarkdownPage["file"];

export function Breadcrumbs() {
    const {
        file,
        collection: { fileNameDateFormat, folder, linkedFolders },
    } = useObjoContext();

    const files: SMarkdownPageFile[] = getAPI().pages(`"${folder}"`).to("file").array();
    const fileDates = new Map<string, DateTime<true>>(
        files
            .map((f) => [f.name, DateTime.fromFormat(f.name, fileNameDateFormat)] as [string, DateTime])
            .filter(([, date]) => date.isValid),
    );

    if (fileDates.size > 1) {
        const sortedFiles = sortBy(
            files.filter((f) => fileDates.has(f.name)),
            (f: SMarkdownPageFile) => fileDates.get(f.name),
        );
        const curr = sortedIndexBy(sortedFiles, file, (f: TFile | SMarkdownPageFile) =>
            fileDates.get("basename" in f ? f.basename : f.name),
        );
        const next = (curr + 1) % sortedFiles.length;
        const prev = (curr + sortedFiles.length - 1) % sortedFiles.length;
        const breadcrumbs = [
            sortedFiles[prev].link,
            prev < curr ? "←" : "↻",
            sortedFiles[curr].name,
            next > curr ? "→" : "↺",
            sortedFiles[next].link,
        ].join(" ");

        const linkedFiles = linkedFolders.map((link) => `[[${link.folder}/${file.basename}|${link.label}]]`);

        return <Markdown md={[breadcrumbs, ...linkedFiles].join(" ｜ ")} />;
    }
    return <p>{file.basename}</p>;
}
