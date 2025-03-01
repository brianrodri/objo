import { Interval } from "luxon";

export const WITH_OVERLAPPING_INTERVALS = {
    "pair of overlapping intervals": [
        Interval.fromISO("2025-03-01/2025-03-04", { zone: "utc" }),
        Interval.fromISO("2025-03-02/2025-03-05", { zone: "utc" }),
    ],

    "group of equal intervals": [
        Interval.fromISO("2025-03-01/2025-03-07", { zone: "utc" }),
        Interval.fromISO("2025-03-01/2025-03-07", { zone: "utc" }),
        Interval.fromISO("2025-03-01/2025-03-07", { zone: "utc" }),
        Interval.fromISO("2025-03-01/2025-03-07", { zone: "utc" }),
        Interval.fromISO("2025-03-01/2025-03-07", { zone: "utc" }),
    ],

    "group of overlapping intervals with the same start time": [
        Interval.fromISO("2025-03-01/2025-03-04", { zone: "utc" }),
        Interval.fromISO("2025-03-01/2025-03-05", { zone: "utc" }),
        Interval.fromISO("2025-03-01/2025-03-06", { zone: "utc" }),
    ],

    "group of overlapping intervals with the same end time": [
        Interval.fromISO("2025-03-01/2025-03-06", { zone: "utc" }),
        Interval.fromISO("2025-03-02/2025-03-06", { zone: "utc" }),
        Interval.fromISO("2025-03-03/2025-03-06", { zone: "utc" }),
    ],

    "group of overlapping intervals with non-overlapping intervals in between": [
        Interval.fromISO("2025-03-01/2025-03-04", { zone: "utc" }),
        Interval.fromISO("2025-03-02/2025-03-05", { zone: "utc" }),
        Interval.fromISO("2025-03-13/2025-03-16", { zone: "utc" }),
        Interval.fromISO("2025-03-21/2025-03-24", { zone: "utc" }),
        Interval.fromISO("2025-03-22/2025-03-25", { zone: "utc" }),
        Interval.fromISO("2025-04-02/2025-04-05", { zone: "utc" }),
        Interval.fromISO("2025-04-13/2025-04-16", { zone: "utc" }),
        Interval.fromISO("2025-04-14/2025-04-17", { zone: "utc" }),
    ],

    "group of one interval before an overlapping group": [
        Interval.fromISO("2025-03-01/2025-03-03", { zone: "utc" }),
        Interval.fromISO("2025-03-05/2025-03-08", { zone: "utc" }),
        Interval.fromISO("2025-03-06/2025-03-09", { zone: "utc" }),
        Interval.fromISO("2025-03-07/2025-03-10", { zone: "utc" }),
    ],

    "group of one interval after an overlapping group": [
        Interval.fromISO("2025-03-05/2025-03-08", { zone: "utc" }),
        Interval.fromISO("2025-03-06/2025-03-09", { zone: "utc" }),
        Interval.fromISO("2025-03-07/2025-03-10", { zone: "utc" }),
        Interval.fromISO("2025-03-11/2025-03-13", { zone: "utc" }),
    ],
} as Record<string, Interval<true>[]>;

export const WITHOUT_OVERLAPPING_INTERVALS = {
    "empty group of intervals": [],
    "group of one interval": [Interval.fromISO("2025-03-01/2025-03-04", { zone: "utc" })],

    "pair of non-overlapping intervals": [
        Interval.fromISO("2025-03-01/2025-03-04", { zone: "utc" }),
        Interval.fromISO("2025-03-14/2025-03-15", { zone: "utc" }),
    ],

    "group of adjacent intervals": [
        Interval.fromISO("2025-03-01/2025-03-02", { zone: "utc" }),
        Interval.fromISO("2025-03-02/2025-03-03", { zone: "utc" }),
        Interval.fromISO("2025-03-03/2025-03-04", { zone: "utc" }),
        Interval.fromISO("2025-03-04/2025-03-05", { zone: "utc" }),
        Interval.fromISO("2025-03-05/2025-03-06", { zone: "utc" }),
    ],

    "group of non-overlapping intervals": [
        Interval.fromISO("2025-03-01/2025-03-03", { zone: "utc" }),
        Interval.fromISO("2025-03-05/2025-03-07", { zone: "utc" }),
        Interval.fromISO("2025-03-09/2025-03-11", { zone: "utc" }),
        Interval.fromISO("2025-03-13/2025-03-15", { zone: "utc" }),
    ],
} as Record<string, Interval<true>[]>;
