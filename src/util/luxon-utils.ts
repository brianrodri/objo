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

import { assertEachWith } from "./assert-utils";

export function assertValid(value: DateTimeMaybeValid, message?: string): asserts value is DateTime<true>;
export function assertValid(value: DurationMaybeValid, message?: string): asserts value is Duration<true>;
export function assertValid(value: IntervalMaybeValid, message?: string): asserts value is Interval<true>;

/**
 * Asserts that the provided Luxon value is valid.
 *
 * This function checks whether a Luxon date, duration, or interval is valid. If the value is invalid,
 * it throws an error with details from the value's `invalidReason` and `invalidExplanation` properties.
 * @param value - The Luxon object to validate.
 * @param message - Optional custom header for the error message.
 * @throws If the provided value is invalid.
 */
export function assertValid(
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
 * @param format - The date format string to validate.
 * @param options - Optional formatting and parsing options for date-time operations.
 * @see {@link https://moment.github.io/luxon/#/parsing?id=table-of-tokens}
 * @throws If the date format does not produce matching formatted strings upon parsing.
 */
export function assertValidDateTimeFormat(format: string, options?: DateTimeOptions): void {
    const sourceDate = DateTime.fromMillis(0).setZone("utc"); // Any valid UTC date would work.
    const parsedDate = DateTime.fromFormat(sourceDate.toFormat(format, options), format, options);
    assert(
        parsedDate.isValid && parsedDate.toFormat(format, options) === sourceDate.toFormat(format, options),
        `format=${JSON.stringify(format)} and options=${JSON.stringify(options)} must make round-trip conversions`,
    );
}

/**
 * Merge an array of {@link Interval}s into an equivalent minimal set of {@link Interval}s.
 * Only combines _intersecting_ intervals. Use {@link Interval.merge} to, additionally, merge _adjacent_ intervals.
 * @param input - The intervals to merge. Must all be valid.
 * @returns An equivalent minimal set of Intervals without any intersections.
 */
export function mergeIntersecting(input: IntervalMaybeValid[]): Interval<true>[] {
    assertEachWith(input, assertValid, "all inputs must be valid");
    const sortedOutput: Interval<true>[] = [];
    for (const sortedNext of sortBy(input, ["start", "end"])) {
        const prevIndex = sortedOutput.length - 1;
        if (prevIndex >= 0 && sortedOutput[prevIndex].intersection(sortedNext)) {
            const union = sortedOutput[prevIndex].union(sortedNext);
            assertValid(union);
            sortedOutput[prevIndex] = union;
        } else {
            sortedOutput.push(sortedNext);
        }
    }
    return sortedOutput;
}
