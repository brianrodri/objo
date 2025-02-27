import { describe, expectTypeOf, it } from "vitest";

import { PathOf } from "../type-utils";

describe("PathOf", () => {
    it("returns the type of the first property of an object", () => {
        expectTypeOf<PathOf<{ a: { b: { c: string } } }>>().toEqualTypeOf<"a" | "a.b" | "a.b.c">();
    });
});
