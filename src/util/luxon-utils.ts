import { AssertionError } from "assert";
import { DateTime, Duration, Interval } from "luxon";

/** Union of luxon types that can be checked for validity. */
export type LuxonValue<IsValid extends boolean> = DateTime<IsValid> | Duration<IsValid> | Interval<IsValid>;

/**
 * @param value - the {@link LuxonValue} to check.
 * @param message - the message to use in the error.
 * @throws error if value is invalid.
 */
export function assertValid(
    value: LuxonValue<true> | LuxonValue<false>,
    message?: string,
): asserts value is LuxonValue<true> {
    if (!value.isValid) {
        const { invalidReason, invalidExplanation } = value;
        const header = message ?? `Invalid ${value.constructor.name}`;
        const reason = invalidExplanation ? `${invalidReason}: ${invalidExplanation}` : invalidReason;
        throw new AssertionError({ message: `${header}: ${reason}`, actual: false, expected: true, operator: "==" });
    }
}
