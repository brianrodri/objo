import { vi } from "vitest";
import { mockDeep } from "vitest-mock-extended";

import { DataviewMarkdownTask } from "@/lib/obsidian-dataview/types";

export const NULL_DATAVIEW_TASK: DataviewMarkdownTask = mockDeep<DataviewMarkdownTask>({
    task: true,
    status: " ",
    checked: false,
    completed: false,
    fullyCompleted: false,
    symbol: "",
    link: { fileName: vi.fn(() => "F"), obsidianLink: vi.fn(() => "L") },
    section: { fileName: vi.fn(() => "F"), obsidianLink: vi.fn(() => "L") },
    path: "",
    line: 0,
    lineCount: 0,
    position: { start: { offset: 0 }, end: { offset: 0 } },
    list: 0,
    children: [],
    outlinks: [],
    text: "",
    tags: [],
    subtasks: [],
    real: false,
    header: { fileName: vi.fn(() => "F"), obsidianLink: vi.fn(() => "L") },
});
