import { expect, test } from "vitest";
import { DEFAULT_SETTINGS } from "./settings";

test("default settings", () => {
    expect(DEFAULT_SETTINGS).toBeDefined();
});
