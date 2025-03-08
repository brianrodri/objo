import { constant } from "lodash";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DataviewMarkdownTask } from "@/lib/obsidian-dataview/types";
import { Task } from "@/model/task/schema";

import { NULL_DATAVIEW_TASK } from "./obsidian-dataview.test.const";
import { adaptDataviewMarkdownTask } from "../obsidian-dataview";

describe(`${adaptDataviewMarkdownTask.name}`, () => {
    afterEach(() => vi.resetAllMocks());

    it.each([
        [{ status: " ", fullyCompleted: false, checked: false }, { status: { symbol: " ", type: "OPEN" } }],
        [{ status: "x", fullyCompleted: true, checked: true }, { status: { symbol: "x", type: "DONE" } }],
        [{ status: "-", fullyCompleted: false, checked: true }, { status: { symbol: "-", type: "CANCELLED" } }],
        [{ path: "P" }, { source: { path: "P" } }],
        [{ line: 42 }, { source: { lineNumber: 42 } }],
        [{ tags: ["tag1", "tag2"] }, { tags: new Set(["tag1", "tag2"]) }],
        [
            { section: { fileName: constant("F"), obsidianLink: constant("L"), subpath: "H" } },
            { source: { name: "F", obsidianHref: "L", section: "H" } },
        ],
        [
            { position: { start: { offset: 42, line: 2, col: 6 }, end: { offset: 83, line: 2, col: 47 } } },
            { source: { startByte: 42, stopByte: 83 } },
        ],
    ] as [Partial<DataviewMarkdownTask>, Partial<Task>][])(
        "converts task from dataview=%j to objo=%j",
        (dataviewPart, objoPart) => {
            expect(adaptDataviewMarkdownTask({ ...NULL_DATAVIEW_TASK, ...dataviewPart })).toMatchObject(objoPart);
        },
    );
});
