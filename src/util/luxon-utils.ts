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
 * Asserts that the provided date format yields consistent results when formatting and parsing a date.
 *
 * This function formats a fixed UTC reference date into a string using the given format and optional options,
 * then parses that string back into a date. It verifies that the parsed date is valid and that reformatting it
 * produces the original string. Failing this consistency check triggers an error, indicating that the format is invalid
 * for round-trip date conversions.
 * @param dateFormat - The date format string to validate.
 * @param dateOptions - Optional formatting and parsing options for date-time operations.
 * @see {@link https://moment.github.io/luxon/#/parsing?id=table-of-tokens}
 * @throws {AssertionError} If the date format does not produce matching formatted strings upon parsing.
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
