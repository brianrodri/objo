import { describe, expectTypeOf, it } from "vitest";

import { PathsOf } from "../type-utils";

describe("PathOf", () => {
    it("returns the type of the first property of an object", () => {
        expectTypeOf<PathsOf<{ a: { b: { c: string } } }>>().toEqualTypeOf<"a" | "a.b" | "a.b.c">();
    });
});
