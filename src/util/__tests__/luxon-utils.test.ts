import { DateTime, DateTimeMaybeValid, Duration, DurationMaybeValid, Interval, IntervalMaybeValid } from "luxon";
import { describe, expect, expectTypeOf, it } from "vitest";

import { assertValidDateTimeFormat, assertValidLuxonValue, mergeIntersecting } from "../luxon-utils";
import { MERGE_INTERSECTING_TEST_CASES } from "./luxon-utils.test.const";

describe(`${assertValidLuxonValue.name}`, () => {
    const reason = "user-provided reason";
    const explanation = "user-provided explanation";

    describe.each(["user-provided message", undefined])("with message=%j", (message) => {
        it("should accept valid datetimes", () => {
            const value = DateTime.fromISO("2025-03-05");
            expectTypeOf(value).toEqualTypeOf<DateTimeMaybeValid>();
            assertValidLuxonValue(value, message);
            expectTypeOf(value).toEqualTypeOf<DateTime<true>>();
        });

        it("should accept valid durations", () => {
            const value = Duration.fromDurationLike({ days: 1 }) as DurationMaybeValid;
            expectTypeOf(value).toEqualTypeOf<DurationMaybeValid>();
            assertValidLuxonValue(value, message);
            expectTypeOf(value).toEqualTypeOf<Duration<true>>();
        });

        it("should accept valid intervals", () => {
            const value = Interval.after(DateTime.now(), { days: 1 });
            expectTypeOf(value).toEqualTypeOf<IntervalMaybeValid>();
            assertValidLuxonValue(value, message);
            expectTypeOf(value).toEqualTypeOf<Interval<true>>();
        });

        it("should reject invalid datetimes", () => {
            const value = DateTime.invalid(reason, explanation);
            expect(() => assertValidLuxonValue(value, message)).toThrowErrorMatchingSnapshot();
        });

        it("should reject invalid durations", () => {
            const value = Duration.invalid(reason, explanation);
            expect(() => assertValidLuxonValue(value, message)).toThrowErrorMatchingSnapshot();
        });

        it("should reject invalid intervals", () => {
            const value = Interval.invalid(reason, explanation);
            expect(() => assertValidLuxonValue(value, message)).toThrowErrorMatchingSnapshot();
        });
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

describe(`${mergeIntersecting.name}`, () => {
    it.each(MERGE_INTERSECTING_TEST_CASES)("$name", ({ input, output }) => {
        expect(mergeIntersecting(input)).toEqual(output);
    });
});
