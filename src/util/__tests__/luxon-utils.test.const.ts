import { Interval } from "luxon";

import { assertValid } from "../luxon-utils";

type MergeIntersectingTestCase = { name: string; input: Interval<true>[]; output: Interval<true>[] };

const toInterval = (iso: string): Interval<true> => {
    const interval = Interval.fromISO(iso);
    assertValid(interval);
    return interval;
};

export const MERGE_INTERSECTING_TEST_CASES: MergeIntersectingTestCase[] = [
    {
        name: "should return same array when given empty array",
        input: [],
        output: [],
    },
    {
        name: "should return same array when given array of size 1",
        input: ["2025-03-10/2025-03-11"],
        output: ["2025-03-10/2025-03-11"],
    },
    {
        name: "should merge equal intervals into one",
        input: ["2025-03-10/2025-03-11", "2025-03-10/2025-03-11", "2025-03-10/2025-03-11"],
        output: ["2025-03-10/2025-03-11"],
    },
    {
        name: "should merge intersecting intervals with the same start date into one",
        input: ["2025-03-10/2025-03-11", "2025-03-10/2025-03-12", "2025-03-10/2025-03-13"],
        output: ["2025-03-10/2025-03-13"],
    },
    {
        name: "should merge intersecting intervals with the same end date into one",
        input: ["2025-03-10/2025-03-14", "2025-03-11/2025-03-14", "2025-03-12/2025-03-14"],
        output: ["2025-03-10/2025-03-14"],
    },
    {
        name: "should not merge adjacent intervals",
        input: ["2025-03-10/2025-03-11", "2025-03-11/2025-03-12", "2025-03-12/2025-03-13"],
        output: ["2025-03-10/2025-03-11", "2025-03-11/2025-03-12", "2025-03-12/2025-03-13"],
    },
    {
        name: "should merge multiple groups of intersecting intervals",
        input: ["2025-03-10/2025-03-12", "2025-03-11/2025-03-13", "2026-03-10/2026-03-12", "2026-03-11/2026-03-13"],
        output: ["2025-03-10/2025-03-13", "2026-03-10/2026-03-13"],
    },
].map(({ input, output, ...rest }) => ({ input: input.map(toInterval), output: output.map(toInterval), ...rest }));
