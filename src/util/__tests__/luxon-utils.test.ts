import { DateTime, DateTimeMaybeValid, Duration, DurationMaybeValid, Interval, IntervalMaybeValid } from "luxon";
import { describe, expect, it } from "vitest";

import { assertLuxonValidity } from "../luxon-utils";

describe(`${assertLuxonValidity.name}`, () => {
    const reason = "user-provided reason";
    const explanation = "user-provided explanation";

    describe.each(["user-provided message", undefined])("with message=%j", (message) => {
        it.each([
            DateTime.fromISO("2025-03-05"),
            Duration.fromDurationLike({ days: 1 }),
            Interval.after(DateTime.now(), { days: 1 }),
        ])("should accept valid $constructor.name", (value) => {
            expect(() => assertLuxonValidity(value, message)).not.toThrow();
        });

        it.each([
            DateTime.invalid(reason, explanation) as DateTimeMaybeValid,
            Duration.invalid(reason, explanation) as DurationMaybeValid,
            Interval.invalid(reason, explanation) as IntervalMaybeValid,
        ])("should reject invalid $constructor.name", (value) => {
            expect(() => assertLuxonValidity(value, message)).toThrowErrorMatchingSnapshot();
        });

        it("should reject undefined", () => {
            expect(() => assertLuxonValidity(undefined, message)).toThrowErrorMatchingSnapshot();
        });
    });
});
