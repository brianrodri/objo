import { Interval } from "luxon";

import { assertValidLuxonValue } from "../luxon-utils";

export const MERGE_INTERSECTING_TEST_CASES = [
    {
        name: "should return same array when given empty array",
        input: [],
        output: [],
    },
    {
        name: "should return same array when given array of size 1",
        input: ["2025-03-10/2025-03-11"].map(toInterval),
        output: ["2025-03-10/2025-03-11"].map(toInterval),
    },
    {
        name: "should merge equal intervals into one",
        input: ["2025-03-10/2025-03-11", "2025-03-10/2025-03-11", "2025-03-10/2025-03-11"].map(toInterval),
        output: ["2025-03-10/2025-03-11"].map(toInterval),
    },
    {
        name: "should merge intersecting intervals with the same start date into one",
        input: ["2025-03-10/2025-03-11", "2025-03-10/2025-03-12", "2025-03-10/2025-03-13"].map(toInterval),
        output: ["2025-03-10/2025-03-13"].map(toInterval),
    },
    {
        name: "should merge intersecting intervals with the same end date into one",
        input: ["2025-03-10/2025-03-14", "2025-03-11/2025-03-14", "2025-03-12/2025-03-14"].map(toInterval),
        output: ["2025-03-10/2025-03-14"].map(toInterval),
    },
    {
        name: "should not merge adjacent intervals",
        input: ["2025-03-10/2025-03-11", "2025-03-11/2025-03-12", "2025-03-12/2025-03-13"].map(toInterval),
        output: ["2025-03-10/2025-03-11", "2025-03-11/2025-03-12", "2025-03-12/2025-03-13"].map(toInterval),
    },
    {
        name: "should merge multiple groups of intersecting intervals",
        input: ["2025-03-10/2025-03-12", "2025-03-11/2025-03-13", "2026-03-10/2026-03-12", "2026-03-11/2026-03-13"].map(
            toInterval,
        ),
        output: ["2025-03-10/2025-03-13", "2026-03-10/2026-03-13"].map(toInterval),
    },
];

/**
 * @param iso - The ISO string to convert to an interval.
 * @returns The interval created from the provided ISO string.
 */
function toInterval(iso: string): Interval<true> {
    const interval = Interval.fromISO(iso);
    assertValidLuxonValue(interval);
    return interval;
}
