import assert from "assert";
import { sortBy } from "lodash";
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
 * @throws If the date format does not produce matching formatted strings upon parsing.
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

/**
 * Merges intersecting intervals from an unsorted array.
 *
 * This function takes an unsorted array of valid Luxon Interval objects and returns a new
 * array where any overlapping intervals are merged. If the input array contains fewer than
 * two intervals, a shallow copy is returned. Otherwise, the intervals are sorted by their start
 * and end times before sequentially merging any that intersect. The union of intersecting intervals
 * is validated to ensure correctness.
 *
 * @param unsorted - An unsorted array of Interval objects.
 * @returns An array of Interval objects with merged overlapping intervals.
 */
export function mergeIntersecting(unsorted: Interval<true>[]): Interval<true>[] {
    if (unsorted.length < 2) {
        return [...unsorted];
    } else {
        const [first, ...sortedRest] = sortBy(unsorted, ["start", "end"]);
        const sortedNonIntersecting = [first];
        for (const next of sortedRest) {
            const last = sortedNonIntersecting[sortedNonIntersecting.length - 1];
            if (last.intersection(next)) {
                const union = last.union(next);
                assertValidLuxonValue(union);
                sortedNonIntersecting[sortedNonIntersecting.length - 1] = union;
            } else {
                sortedNonIntersecting.push(next);
            }
        }
        return sortedNonIntersecting;
    }
}
