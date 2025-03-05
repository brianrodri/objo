import AggregateError from "aggregate-error";
import { isString, sortBy } from "lodash";
import { DateTime, Duration, Interval } from "luxon";

/**
 * @param obj - the invalid luxon object.
 * @param message - optional message included with the error.
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
 * @returns [index inclusive, index exclusive) pairs for slices in the array with overlapping intervals.
 */
export function getIndexCollisions(sorted: readonly Interval<true>[]): [number, number][] {
    const collisions: [number, number][] = [];
    let startIncl = 0;

    for (let stopExcl = startIncl; stopExcl <= sorted.length; ++stopExcl) {
        const oldStartIncl = startIncl;

        while (startIncl < stopExcl && !sorted[startIncl].intersection(sorted[stopExcl - 1])) {
            startIncl += 1;
        }
        if (startIncl - oldStartIncl >= 2) {
            collisions.push([oldStartIncl, stopExcl - 1]);
        }
    }
    if (sorted.length - startIncl >= 2) {
        collisions.push([startIncl, sorted.length]);
    }

    return collisions;
}

/**
 * Asserts that none of the intervals are overlapping.
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
