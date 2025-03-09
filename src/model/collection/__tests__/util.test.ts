import { describe, expect, it } from "vitest";

import { stripTrailingSlash } from "../util";

describe(`${stripTrailingSlash.name}`, () => {
    it("should strip trailing slashes", () => {
        expect(stripTrailingSlash("foo/")).toEqual("foo");
    });

    it("should do nothing if there are no trailing slashes", () => {
        expect(stripTrailingSlash("foo")).toEqual("foo");
    });

    it("should do nothing when folder is the vault root", () => {
        expect(stripTrailingSlash("/")).toEqual("/");
    });
});
