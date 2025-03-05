import { describe, expectTypeOf, it } from "vitest";

import { PathsOf } from "../type-utils";

describe("PathsOf", () => {
    it("returns the type of the first property of an object", () => {
        type Obj = { a: { b: { c: string } } };

        expectTypeOf<PathsOf<Obj>>().toEqualTypeOf<"a" | "a.b" | "a.b.c">();
    });
});
