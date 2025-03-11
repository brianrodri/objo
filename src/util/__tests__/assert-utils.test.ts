import assert from "assert";
import { isNumber } from "lodash";
import { describe, expect, expectTypeOf, it } from "vitest";

import { assertEachWith } from "../assert-utils";

/** @param x - value that must be a number. */
function assertNumber(x: unknown): asserts x is number {
    assert(isNumber(x), `${JSON.stringify(x)} is not a number`);
}

describe(`${assertEachWith.name}`, () => {
    describe.each(["user-provided message", undefined])("with message=%j", (message) => {
        it("should accept valid values", () => {
            const items: (number | string)[] = [1, 2, 3, 4, 5];
            expectTypeOf(items).toEqualTypeOf<(number | string)[]>();
            assertEachWith(items, assertNumber, message);
            expectTypeOf(items).toEqualTypeOf<number[]>();
        });

        it("should reject invalid values", () => {
            const items: (number | string)[] = [1, "2", 3, "4", 5];
            expectTypeOf(items).toEqualTypeOf<(number | string)[]>();
            expect(() => assertEachWith(items, assertNumber, message)).toThrowErrorMatchingSnapshot();
            expectTypeOf(items).not.toEqualTypeOf<number[]>();
        });
    });
});
