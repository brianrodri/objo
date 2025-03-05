import { describe, expect, it } from "vitest";

import { sanitizeFolder } from "../util";

describe(`${sanitizeFolder.name}`, () => {
    it("should strip trailing slashes", () => {
        expect(sanitizeFolder("foo/")).toEqual("foo");
    });

    it("should do nothing if there are no trailing slashes", () => {
        expect(sanitizeFolder("foo")).toEqual("foo");
    });

    it("should do nothing when folder is the vault root", () => {
        expect(sanitizeFolder("/")).toEqual("/");
    });
});
