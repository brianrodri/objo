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
 * @param dateFormat - the format to check.
 * @param dateOptions - the options to use when parsing and formatting.
 * @see {@link https://moment.github.io/luxon/#/parsing?id=table-of-tokens}
 */
export function assertLuxonFormat(
    dateFormat: string,
    dateOptions?: DateTimeOptions,
): asserts dateFormat is LuxonFormat {
    // NOTE: Any valid UTC date works.
    const sourceDate = DateTime.fromMillis(0).setZone("utc");
    const parsedDate = DateTime.fromFormat(sourceDate.toFormat(dateFormat, dateOptions), dateFormat, dateOptions);
    assert(
        parsedDate.isValid &&
            parsedDate.toFormat(dateFormat, dateOptions) === sourceDate.toFormat(dateFormat, dateOptions),
        "date format must parse the formatted strings it produces",
    );
}
