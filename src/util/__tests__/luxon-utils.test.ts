import { DateTime, Duration, Interval } from "luxon";
import { describe, expect, it } from "vitest";

import { assertValidDateTimeFormat, assertValidLuxonValue } from "../luxon-utils";

describe(`${assertValidLuxonValue.name}`, () => {
    const reason = "user-provided reason";
    const explanation = "user-provided explanation";

    describe.each(["user-provided message", undefined])("with message=%j", (message) => {
        it.each([
            DateTime.fromISO("2025-03-05"),
            Duration.fromDurationLike({ days: 1 }),
            Interval.after(DateTime.now(), { days: 1 }),
        ])("should accept valid $constructor.name", (value) => {
            expect(() => assertValidLuxonValue(value, message)).not.toThrow();
        });

        it.each([DateTime.fromISO("2025-03-99"), Duration.invalid(reason), Interval.invalid(reason, explanation)])(
            "should reject invalid $constructor.name",
            (value) => {
                expect(() => assertValidLuxonValue(value, message)).toThrowErrorMatchingSnapshot();
            },
        );
    });
});

describe(`${assertValidDateTimeFormat.name}`, () => {
    it.each(["yyyy-MM-dd", "kkkk-'W'WW", "yyyy-MM"])("should accept valid format=%j", (validFormat) => {
        expect(() => assertValidDateTimeFormat(validFormat)).not.toThrow();
    });

    it.each(["FF", "''"])("should reject invalid format=%j", (invalidFormat) => {
        expect(() => assertValidDateTimeFormat(invalidFormat)).toThrowErrorMatchingSnapshot();
    });
});
