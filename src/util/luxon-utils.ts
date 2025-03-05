import AggregateError from "aggregate-error";
import { isString, sortBy } from "lodash";
import { DateTime, Duration, Interval } from "luxon";

/**
 * @param obj - the invalid luxon object.
 * @param message - optional message to include with the error.
 * @returns error with debug information extracted from the "invalid" input.
 */
export function newInvalidError(obj?: DateTime<false> | Duration<false> | Interval<false>, message?: string): Error {
    const lines = isString(message) ? [message] : [];
    lines.push(
        obj ?
            `Invalid${obj.constructor.name}: ${obj.invalidReason}. ${obj.invalidExplanation}`.trim()
        :   `unspecified error`,
    );
    return new Error(lines.join("\n"));
}

/**
 * @param sorted - an array of intervals sorted by start time (primary) and end time (secondary).
 * @returns array of [index inclusive, index exclusive) pairs for each sub-sequence of overlapping intervals.
 */
export function getIndexCollisions(sorted: readonly Interval<true>[]): [number, number][] {
    const collidingRanges: [number, number][] = [];
    let startIncl = 0;

    for (let stopExcl = 1; stopExcl <= sorted.length; ++stopExcl) {
        const oldStartInclusive = startIncl;

        while (startIncl < stopExcl && !sorted[startIncl].intersection(sorted[stopExcl - 1])) {
            startIncl += 1;
        }

        if (startIncl - oldStartInclusive >= 2) {
            collidingRanges.push([oldStartInclusive, stopExcl - 1]);
        }
    }

    if (sorted.length - startIncl >= 2) {
        collidingRanges.push([startIncl, sorted.length]);
    }

    return collidingRanges;
}

/**
 * Asserts that the given array of intervals have no intersections.
 * @param unsorted - the array of intervals to check.
 * @throws error if the array has overlapping intervals.
 */
export function assertNoOverlaps(unsorted: readonly Interval<true>[]): void {
    const sorted = sortBy(unsorted, "start", "end");
    const errors = getIndexCollisions(sorted).map(([lo, hi]) => {
        return `unexpected overlapping intervals in the index range [${lo}, ${hi}) of ${JSON.stringify(sorted)}`;
    });

    if (errors.length > 0) {
        throw new AggregateError(errors);
    }
}
