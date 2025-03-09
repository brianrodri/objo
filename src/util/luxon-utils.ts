import assert from "assert";
import { DateTime, DateTimeOptions, Duration, Interval } from "luxon";
import { Brand } from "utility-types";

/** Union of luxon types that can be checked for validity. */
export type LuxonValue<IsValid extends boolean> = DateTime<IsValid> | Duration<IsValid> | Interval<IsValid>;

/** A format string that can correctly format and parse {@link DateTime}s. */
export type LuxonFormat = Brand<string, "LuxonFormat">;

/**
 * Asserts that the provided Luxon value is valid.
 *
 * This function checks whether a Luxon date, duration, or interval is valid. If the value is invalid,
 * it throws an error with a message combining a custom header (or default constructor name) with the
 * value's invalid reason and, if available, its invalid explanation.
 * @param value - The Luxon object to validate.
 * @param message - Optional custom header for the error message.
 * @throws If the provided value is invalid.
 */
export function assertValidLuxonValue(
    value: LuxonValue<true> | LuxonValue<false>,
    message?: string,
): asserts value is LuxonValue<true> {
    message ??= `Invalid ${value.constructor.name}`;
    const help = value.invalidExplanation ? `${value.invalidReason}: ${value.invalidExplanation}` : value.invalidReason;
    assert(value.isValid, `${message}: ${help}`);
}

/**
 * @param dateFormat - the format to check.
 * @param dateOptions - the options to use when parsing and formatting.
 * @see {@link https://moment.github.io/luxon/#/parsing?id=table-of-tokens}
 */
export function assertValidDateTimeFormat(
    dateFormat: string,
    dateOptions?: DateTimeOptions,
): asserts dateFormat is LuxonFormat {
    const sourceDate = DateTime.fromMillis(0).setZone("utc"); // NOTE: Any valid UTC date works.
    const parsedDate = DateTime.fromFormat(sourceDate.toFormat(dateFormat, dateOptions), dateFormat, dateOptions);
    assert(
        parsedDate.isValid &&
            parsedDate.toFormat(dateFormat, dateOptions) === sourceDate.toFormat(dateFormat, dateOptions),
        "date format must parse the formatted strings it produces",
    );
}
