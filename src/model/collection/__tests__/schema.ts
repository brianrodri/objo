import { constant } from "lodash";
import { describe, expect, it } from "vitest";

import { Collection } from "../schema";

describe(Collection.name, () => {
    it("returns invalid intervals", () => {
        class TestCollection extends Collection {
            public override includes = constant(false);
        }

        expect(new TestCollection().getIntervalOf("path").isValid).toBe(false);
    });
});
