import assert from "assert";
import { sortBy } from "lodash";
import {
    DateTime,
    DateTimeMaybeValid,
    DateTimeOptions,
    Duration,
    DurationMaybeValid,
    Interval,
    IntervalMaybeValid,
} from "luxon";


export function assertValidLuxonValue(value: DateTimeMaybeValid, message?: string): asserts value is DateTime<true>;
export function assertValidLuxonValue(value: DurationMaybeValid, message?: string): asserts value is Duration<true>;
export function assertValidLuxonValue(value: IntervalMaybeValid, message?: string): asserts value is Interval<true>;

/**
 * Asserts that the provided Luxon value is valid.
 *
 * This function checks whether a Luxon date, duration, or interval is valid. If the value is invalid,
 * it throws an error with details from the value's `invalidReason` and `invalidExplanation` properties.
 * @param value - The Luxon object to validate.
 * @param message - Optional custom header for the error message.
 * @throws If the provided value is invalid.
 */
export function assertValidLuxonValue(
    value: DateTimeMaybeValid | DurationMaybeValid | IntervalMaybeValid,
    message?: string,
): asserts value is DateTime<true> | Duration<true> | Interval<true> {
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
export function assertValidDateTimeFormat(dateFormat: string, dateOptions?: DateTimeOptions): void {
    const sourceDate = DateTime.fromMillis(0).setZone("utc"); // NOTE: Any valid UTC date works.
    const parsedDate = DateTime.fromFormat(sourceDate.toFormat(dateFormat, dateOptions), dateFormat, dateOptions);
    assert(
        parsedDate.isValid &&
            parsedDate.toFormat(dateFormat, dateOptions) === sourceDate.toFormat(dateFormat, dateOptions),
        "date format must parse the formatted strings it produces",
    );
}

/**
 * Merge an array of {@link Interval}s into an equivalent minimal set of {@link Interval}s.
 * Only combines _intersecting_ intervals. Use {@link Interval.merge} to, additionally, merge _adjacent_ intervals.
 * @param input - The intervals to merge. Must all be valid.
 * @returns An equivalent minimal set of Intervals without any intersections.
 */
export function mergeIntersecting(input: Interval<true>[]): Interval<true>[] {
    input.forEach((interval) => assertValidLuxonValue(interval));
    const sortedOutput: Interval<true>[] = [];
    for (const sortedNext of sortBy(input, ["start", "end"])) {
        const prevIndex = sortedOutput.length - 1;
        if (prevIndex >= 0 && sortedOutput[prevIndex].intersection(sortedNext)) {
            const union = sortedOutput[prevIndex].union(sortedNext);
            assertValidLuxonValue(union);
            sortedOutput[prevIndex] = union;
        } else {
            sortedOutput.push(sortedNext);
        }
    }
    return sortedOutput;
}
