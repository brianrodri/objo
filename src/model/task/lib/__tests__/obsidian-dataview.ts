import { afterEach, describe, expect, it, vi } from "vitest";

import { Plugin } from "@/lib/obsidian/types";
import { DataviewMarkdownTask } from "@/lib/obsidian-dataview/types";

import { adaptDataviewMarkdownTask } from "../obsidian-dataview";

describe("Converting dataview tasks into objo tasks", () => {
    afterEach(() => vi.resetAllMocks());

    it.each([
        [{ status: " ", fullyCompleted: false, checked: false }, { status: { symbol: " ", type: "OPEN" } }],
        [{ status: "x", fullyCompleted: true, checked: true }, { status: { symbol: "x", type: "DONE" } }],
        [{ status: "-", fullyCompleted: false, checked: true }, { status: { symbol: "-", type: "CANCELLED" } }],
        [{ path: "path" }, { source: { path: "path" } }],
        [{ line: 42 }, { source: { lineNumber: 42 } }],
        [{ tags: ["tag1", "tag2"] }, { tags: new Set(["tag1", "tag2"]) }],
        [
            { section: { fileName: () => "fname", obsidianLink: () => "olink", subpath: "heading" } },
            { source: { name: "fname", obsidianHref: "olink", section: "heading" } },
        ],
        [
            { position: { start: { offset: 42, line: 2, col: 5 }, end: { offset: 43, line: 2, col: 6 } } },
            { source: { startByte: 42, stopByte: 43 } },
        ],
    ])("converts dvTask=%j to objoTask=%j", (dataviewTaskPart, objoTaskPart) => {
        expect(adaptDataviewMarkdownTask({ ...NULL_DATAVIEW_TASK, ...dataviewTaskPart })).toMatchObject(objoTaskPart);
    });
});

const NULL_DATAVIEW_TASK = {
    x: {} as Plugin,
    task: true,
    status: " ",
    checked: false,
    completed: false,
    fullyCompleted: false,
    symbol: "",
    link: undefined,
    section: { fileName: vi.fn(), obsidianLink: vi.fn() },
    path: "",
    line: 0,
    lineCount: 0,
    position: {
        start: {
            line: 0,
            col: 0,
            offset: 0,
        },
        end: {
            line: 0,
            col: 0,
            offset: 0,
        },
    },
    list: 0,
    children: [],
    outlinks: [],
    text: "",
    tags: [],
    subtasks: [],
    real: false,
    header: undefined,
} as const satisfies DataviewMarkdownTask;
