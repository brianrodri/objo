import { expect, expectTypeOf, test } from "vitest";

import { DEFAULT_SETTINGS, ObjoSettings } from "./settings";

test("default settings", () => {
    expect(DEFAULT_SETTINGS).toBeDefined();
    expectTypeOf(DEFAULT_SETTINGS).toEqualTypeOf<ObjoSettings>();
});
