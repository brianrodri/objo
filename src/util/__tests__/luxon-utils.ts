import { entriesIn } from "lodash";
import { DateTime, Duration, Interval } from "luxon";
import { describe, expect, it } from "vitest";

import { assertNoOverlaps, newInvalidError } from "../luxon-utils";
import { WITH_OVERLAPPING_INTERVALS, WITHOUT_OVERLAPPING_INTERVALS } from "./luxon-utils.const";

describe(newInvalidError.name, () => {
    const reason = "reason";
    const explanation = "explanation";

    describe.each(["user-provided message", undefined])("with message %j", (message) => {
        it.each([DateTime, Duration, Interval].map((ctor) => ctor.invalid(reason, explanation)))(
            "should accept invalid $constructor.name",
            (invalidObj) => {
                const errorMessage = newInvalidError(invalidObj, message).message;
                expect(errorMessage).toMatch(message ?? "");
                expect(errorMessage).toMatch(reason);
                expect(errorMessage).toMatch(explanation);
            },
        );

        it("should accept undefined", () => {
            const errorMessage = newInvalidError().message;
            expect(errorMessage).toMatch("unspecified error");
        });
    });
});

describe(assertNoOverlaps.name, () => {
    describe.each(["user-provided message", undefined])("with message %j", (message) => {
        it.each(entriesIn(WITHOUT_OVERLAPPING_INTERVALS))("should accept %j", (_, intervals) => {
            expect(() => assertNoOverlaps(intervals, message)).not.toThrow();
        });

        it.each(entriesIn(WITH_OVERLAPPING_INTERVALS))("should reject %j", (_, intervals) => {
            expect(() => assertNoOverlaps(intervals, message)).toThrowErrorMatchingSnapshot();
        });
    });
});
