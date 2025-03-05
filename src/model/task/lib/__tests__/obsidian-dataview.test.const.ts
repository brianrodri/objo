import { constant } from "lodash";

import { DataviewMarkdownTask } from "@/lib/obsidian-dataview/types";

export const NULL_DATAVIEW_TASK: DataviewMarkdownTask = {
    task: true,
    status: " ",
    checked: false,
    completed: false,
    fullyCompleted: false,
    symbol: "",
    link: undefined,
    section: {
        fileName: constant(undefined),
        obsidianLink: constant(undefined),
        subpath: undefined,
    },
    path: "",
    line: 0,
    lineCount: 0,
    position: {
        start: { line: 0, col: 0, offset: 0 },
        end: { line: 0, col: 0, offset: 0 },
    },
    list: 0,
    children: [],
    outlinks: [],
    text: "",
    tags: [],
    subtasks: [],
    real: false,
    header: undefined,
} as const;
