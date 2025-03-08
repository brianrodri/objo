import { AssertionError } from "assert";
import { DateTime, Duration, Interval } from "luxon";

/** Union of luxon types that can be checked for validity. */
export type LuxonValue<IsValid extends boolean> = DateTime<IsValid> | Duration<IsValid> | Interval<IsValid>;

/**
 * Asserts that the provided Luxon value is valid.
 *
 * Checks the `isValid` property of the given Luxon value and throws an {@link AssertionError}
 * if the value is invalid. When invalid, the error message incorporates a custom header (if provided)
 * or a default header based on the value's type, along with details from its `invalidReason` and,
 * if available, `invalidExplanation`.
 *
 * @param value - A Luxon date/time, duration, or interval to validate.
 * @param message - Optional custom message to use in the error header.
 *
 * @throws {AssertionError} If the provided value is not valid.
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
