import assert from "assert";
import { isString, sortBy } from "lodash";
import { DateTime, Duration, Interval } from "luxon";

/**
 * @param obj - the invalid luxon object.
 * @param message - optional message to include with the error.
 *
 * @returns an {@link Error} with debug information extracted from the "invalid" input.
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
 *
 * @returns array of [index inclusive, index exclusive) pairs for each sub-sequence of overlapping intervals.
 */
export function getIndexCollisions(sorted: Interval<true>[]): [number, number][] {
    const collidingRanges: [number, number][] = [];

    let startIncl = 0;
    for (let stopExcl = 2; stopExcl <= sorted.length; ++stopExcl) {
        const last = sorted[stopExcl - 1];
        const formerStartIncl = startIncl;
        while (startIncl < stopExcl && !intersects(sorted[startIncl], last)) {
            startIncl += 1;
        }
        if (startIncl - formerStartIncl > 1) {
            collidingRanges.push([formerStartIncl, stopExcl - 1]);
        }
    }
    if (sorted.length - startIncl > 1) {
        collidingRanges.push([startIncl, sorted.length]);
    }

    return collidingRanges;
}

/**
 * @param a - the first interval. Must be _earlier than_ the second interval.
 * @param b - the second interval. Must be _later than_ the first interval.
 *
 * @returns true if the two intervals have a non-empty intersection.
 */
export function intersects(a: Interval<true>, b: Interval<true>): boolean {
    assert(a.start <= b.start && a.end <= b.end);
    return b.overlaps(a) && !b.abutsStart(a);
}

/**
 * Asserts that the given array of intervals have no intersections.
 *
 * @param unsorted - the array of intervals to check.
 * @param message - optional message to include with the error.
 * @throws an {@link Error} if the array has overlapping intervals.
 */
export function assertNoOverlaps(unsorted: ReadonlyArray<Interval<true>>, message?: string): void {
    const sorted = sortBy(unsorted, "start", "end");
    const indexCollisions = getIndexCollisions(sorted);

    if (indexCollisions.length > 0) {
        const lines = isString(message) ? [message] : [];
        lines.push(
            ...indexCollisions.map(([start, end]) => {
                const overlap = Interval.fromDateTimes(sorted[start].start, sorted[end - 1].end);
                return `\t-\tindexes between [${start}, ${end}) all overlap with ${overlap}`;
            }),
        );
        throw new Error(lines.join("\n"));
    }
}
