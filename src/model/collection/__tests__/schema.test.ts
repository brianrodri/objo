import { DateTime, Interval } from "luxon";
import { describe, expect, it, vi } from "vitest";

import { DateBasedCollection } from "../schema";

describe(`${DateBasedCollection.name}`, () => {
    const getIntervalOf = vi.fn();
    class TestCollection extends DateBasedCollection {
        public override getIntervalOf = getIntervalOf;
    }

    it("should include files when its interval is valid", () => {
        getIntervalOf.mockReturnValue(Interval.after(DateTime.now(), { days: 1 }));
        expect(new TestCollection().includes("path")).toBe(true);
    });

    it("should not include files when its interval is invalid", () => {
        getIntervalOf.mockReturnValue(Interval.invalid("invalid"));
        expect(new TestCollection().includes("path")).toBe(false);
    });
});
