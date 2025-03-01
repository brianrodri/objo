import { entriesIn } from "lodash";
import { DateTime, Duration, Interval } from "luxon";
import { describe, expect, it } from "vitest";

import { assertNoOverlaps, newInvalidError } from "../luxon-utils";
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
    describe.each(["user-provided message", undefined])("with message=%j", (message) => {
        it.each(entriesIn(WITHOUT_OVERLAPPING_INTERVALS))("should accept %j", (_, intervals) => {
            expect(() => assertNoOverlaps(intervals, message)).not.toThrow();
        });

        it.each(entriesIn(WITH_OVERLAPPING_INTERVALS))("should reject %j", (_, intervals) => {
            expect(() => assertNoOverlaps(intervals, message)).toThrowErrorMatchingSnapshot();
        });
    });
});
