import { constant } from "lodash";
import { describe, expect, it } from "vitest";

import { Collection } from "../schema";

class TestCollection extends Collection {
    public override id = "id" as const;
    public override includes = constant(false);
}

describe("Collection default implementations", () => {
    it("returns invalid intervals", () => {
        expect(new TestCollection().getIntervalOf("path").isValid).toBe(false);
    });
});
