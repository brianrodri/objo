import AggregateError from "aggregate-error";
import { sortBy } from "lodash";
import { DateTime, Duration, Interval } from "luxon";

/** Union of luxon types that can be checked for validity. */
export type LuxonValue<IsValid extends boolean> = DateTime<IsValid> | Duration<IsValid> | Interval<IsValid>;

/**
 * @param value - the {@link LuxonValue} to check.
 * @param message - the message to use in the error.
 * @throws error if value is invalid.
 */
export function assertLuxonValidity(
    value?: LuxonValue<true> | LuxonValue<false>,
    message?: string,
): asserts value is LuxonValue<true> {
    const lines = message ? [message] : [];
    if (!value) {
        lines.push("undefined luxon value");
    } else if (!value.isValid) {
        lines.push(`${value.invalidReason}. ${value.invalidExplanation}`);
    } else {
        return;
    }
    throw new Error(lines.join("\n"));
}

/**
 * @param unsorted - the {@link Interval}s to check.
 * @throws error if any of the intervals intersect with each other.
 */
export function assertIntervalsDoNotIntersect(unsorted: readonly Interval<true>[]): void {
    const sorted = sortBy(unsorted, "start", "end");
    const errors = getIntersectionsFromSortedIntervals(sorted).map(([lo, hi]) => {
        return `overlapping intervals within index range [${lo}, ${hi}) of ${JSON.stringify(sorted)}`;
    });

    if (errors.length > 0) {
        throw new AggregateError(errors);
    }
}

/**
 * @param sorted - an array of sorted intervals by start time (primary) and end time (secondary).
 * @returns [index inclusive, index exclusive) pairs representing slices of the array that intersect with each other.
 */
function getIntersectionsFromSortedIntervals(sorted: readonly Interval<true>[]): [number, number][] {
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
