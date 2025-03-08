import { AssertionError, ok as assert } from "assert";
import { DateTime, DateTimeOptions, Duration, Interval } from "luxon";
import { Brand } from "utility-types";

/** Union of luxon types that can be checked for validity. */
export type LuxonValue<IsValid extends boolean> = DateTime<IsValid> | Duration<IsValid> | Interval<IsValid>;

/** A format string that can correctly format and parse {@link DateTime}s. */
export type LuxonFormat = Brand<string, "LuxonFormat">;

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

/**
 * @param format - the format to check.
 * @param dateOptions - the options to use when parsing and formatting.
 * @see {@link https://moment.github.io/luxon/#/parsing?id=table-of-tokens}
 */
export function assertLuxonFormat(format: string, dateOptions?: DateTimeOptions): asserts format is LuxonFormat {
    // NOTE: Actual date used here doesn't matter so long as it's valid.
    const date = DateTime.fromISO("2025-07-03T10:29:14-04:00").setZone("utc");
    const dateParsed = DateTime.fromFormat(date.toFormat(format, dateOptions), format, dateOptions);
    assert(
        dateParsed.isValid && date.toFormat(format, dateOptions) === dateParsed.toFormat(format, dateOptions),
        "date format must parse the formatted strings it produces",
    );
}
