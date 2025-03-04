import { entriesIn } from "lodash";
import { DateTime, Duration, Interval } from "luxon";
import { describe, expect, it } from "vitest";

import { assertNoOverlaps, getIndexCollisions, newInvalidError } from "../luxon-utils";
import { WITH_OVERLAPPING_INTERVALS, WITHOUT_OVERLAPPING_INTERVALS } from "./luxon-utils.const";

describe(newInvalidError.name, () => {
    const reason = "user-provided reason";
    const explanation = "user-provided explanation";

    const _throw = (e: Error) => {
        throw e;
    };

    describe.each(["user-provided message", undefined])("with message=%j", (message) => {
        it.each([
            DateTime.invalid(reason, explanation),
            Duration.invalid(reason, explanation),
            Interval.invalid(reason, explanation),
        ])("should accept $constructor.name", (invalidResult) => {
            expect(() => _throw(newInvalidError(invalidResult, message))).toThrowErrorMatchingSnapshot();
        });

        it("should accept undefined", () => {
            expect(() => _throw(newInvalidError(undefined, message))).toThrowErrorMatchingSnapshot();
        });
    });
});

describe(assertNoOverlaps.name, () => {
    it.each(entriesIn(WITHOUT_OVERLAPPING_INTERVALS))("should accept %j", (_, intervals) => {
        expect(() => assertNoOverlaps(intervals)).not.toThrow();
    });

    it.each(entriesIn(WITH_OVERLAPPING_INTERVALS))("should reject %j", (_, intervals) => {
        // TODO: Want to use toThrowErrorMatchingSnapshot(), but the snapshot fails on CI due to different paths in the stack traces.
        expect(() => assertNoOverlaps(intervals)).toThrowError();
    });
});

describe(getIndexCollisions.name, () => {
    it.each(entriesIn(WITHOUT_OVERLAPPING_INTERVALS))("should return nothing from %s", (_, intervals) => {
        expect(getIndexCollisions(intervals)).toEqual([]);
    });

    it.each(entriesIn(WITH_OVERLAPPING_INTERVALS))("should return collisions from %s", (_, intervals) => {
        expect(getIndexCollisions(intervals)).toMatchSnapshot();
    });
});
