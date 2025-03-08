import { DateTime, Duration, Interval } from "luxon";

/** Union of luxon types that can be checked for validity. */
export type LuxonValue<IsValid extends boolean> = DateTime<IsValid> | Duration<IsValid> | Interval<IsValid>;

/**
 * @param value - the {@link LuxonValue} to check.
 * @param message - the message to use in the error.
 * @throws error if value is invalid.
 */
export function assertLuxonValidity(
    value?: LuxonValue<true> | LuxonValue<false>,
    message?: string,
): asserts value is LuxonValue<true> {
    const lines = message ? [message] : [];
    if (!value) {
        lines.push("undefined luxon value");
    } else if (!value.isValid) {
        lines.push(`${value.invalidReason}. ${value.invalidExplanation}`);
    } else {
        return;
    }
    throw new Error(lines.join("\n"));
}
