import { DateTime, Duration, Interval } from "luxon";
import { describe, expect, it } from "vitest";

import { assertValid } from "../luxon-utils";

describe(`${assertValid.name}`, () => {
    const reason = "user-provided reason";
    const explanation = "user-provided explanation";

    describe.each(["user-provided message", undefined])("with message=%j", (message) => {
        it.each([
            DateTime.fromISO("2025-03-05"),
            Duration.fromDurationLike({ days: 1 }),
            Interval.after(DateTime.now(), { days: 1 }),
        ])("should accept valid $constructor.name", (value) => {
            expect(() => assertValid(value, message)).not.toThrow();
        });

        it.each([
            DateTime.fromISO("2025-03-99"),
            Duration.invalid(reason, explanation),
            Interval.invalid(reason, explanation),
        ])("should reject invalid $constructor.name", (value) => {
            expect(() => assertValid(value, message)).toThrowErrorMatchingSnapshot();
        });
    });
});
