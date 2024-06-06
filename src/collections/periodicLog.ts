import { DateTime } from "luxon";
import { TFile } from "obsidian";

import { PeriodicLogConfig } from "@/types/settings";

export interface PeriodicLog extends PeriodicLogConfig {
    type: "periodic-log";
    date: DateTime<true>;
}

export function resolvePeriodicLog(file: TFile, configs: PeriodicLogConfig[]): PeriodicLog | null {
    // TODO: Can I just prevent the parent from being null?
    const folder = file.parent?.path ?? "/";

    // TODO: Does the lookup complexity need to be better than O(n)?
    const matchingConfigs = configs.filter((cfg) => folder === cfg.folder);
    if (matchingConfigs.length > 1) throw new Error(`Exactly one collection must correspond to the path: "${folder}"`);

    const [config] = matchingConfigs;
    if (!config) return null;

    const date = DateTime.fromFormat(file.basename, config.fileNameDateFormat);
    if (!date.isValid) return null;

    return { type: "periodic-log", date, ...config };
}
