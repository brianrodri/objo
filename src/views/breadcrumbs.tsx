import { DateTime, Interval } from "luxon";
import { TFile } from "obsidian";
import { getAPI } from "obsidian-dataview";

import { Markdown } from "@/compat/markdown";
import { useObjoContext } from "@/compat/pluginContext";

export function Breadcrumbs() {
    const { file, collection } = useObjoContext();

    const parseLogDate = (str: string) => DateTime.fromFormat(str, collection.fileNameDateFormat);
    const files = getSiblingFiles(file)
        .filter((f: TFile) => parseLogDate(f.name).isValid)
        .sort((f: TFile) => parseLogDate(f.name));

    if (file && files.length > 1) {
        const interval = Interval.after(parseLogDate(file.basename), { [collection.unit]: 1 });
        const curr = files.findIndex((f: TFile) => interval.contains(parseLogDate(f.name)));
        const next = (curr + 1) % files.length;
        const prev = (curr + files.length - 1) % files.length;
        const breadcrumbs = [
            files[prev].link,
            prev < curr ? "←" : "↻",
            files[curr].name,
            next > curr ? "→" : "↺",
            files[next].link,
        ];

        return <Markdown md={breadcrumbs.join(" ")} />;
    }
    return <p>{file?.basename}</p>;
}

function getSiblingFiles(file: TFile) {
    const folder = file.parent?.path;
    return folder ? getAPI().pages(`"${folder}"`).file : [];
}
