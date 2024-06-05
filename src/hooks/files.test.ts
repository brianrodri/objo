import { renderHook } from "@testing-library/preact";
import { getAPI } from "obsidian-dataview";
import { describe, expect, test, vi } from "vitest";

import { useFiles } from "./files";

vi.mock("obsidian-dataview", () => ({ getAPI: vi.fn() }));

describe("useFiles", () => {
    test("returns pages from API", () => {
        vi.mocked(getAPI).mockReturnValue({ pages: vi.fn(() => ["DailyLog/file1.md"]) });

        const { result } = renderHook(() => useFiles("DailyLog"));

        expect(result.current).toEqual(["DailyLog/file1.md"]);
    });
});
