import assert from "assert";
import { DateTime, DateTimeOptions, Duration, DurationLike, Interval, IntervalMaybeValid } from "luxon";
import { parse } from "path";

import { DateBasedCollection } from "./schema";

/**
 * @see {@link https://github.com/liamcain/obsidian-periodic-notes}
 *
 * A {@link DateBasedCollection} where each file corresponds to a unique {@link Interval} of time.
 * Intended to handle Obsidian's built-in "Daily Notes" plugin and the more-comprehensive "Periodic Notes" community
 * plugin. As a consequence, all files in the collection must be placed in the same folder.
 *
 * TODO: Is it worth supporting files organized into different folders?
 */
export class PeriodicNotes extends DateBasedCollection {
    /** The folder containing all of the notes. */
    public readonly folder: string;

    /**
     * Luxon format used to parse dates from the file's name.
     * @see {@link https://moment.github.io/luxon/#/parsing?id=table-of-tokens}
     */
    public readonly dateFormat: string;

    /**
     * Offset between the file's _parsed_ date and the corresponding {@link Interval}'s _start_ date. May be negative.
     * @example a periodic sprint log using ISO weeks, which start on Monday, as its {@link dateFormat} when sprints
     * _actually_ begin on Thursdays.
     */
    public readonly dateOffset: Duration<true>;

    /**
     * The {@link Duration} of each file's corresponding {@link Interval}.
     * @example a daily log's duration would be `{ days: 1 }`.
     */
    public readonly intervalDuration: Duration<true>;

    /** Luxon options used when parsing {@link DateTime}s from file names. */
    public readonly dateOptions: DateTimeOptions;

    public constructor(
        folder: string,
        dateFormat: string,
        intervalDurationLike: DurationLike,
        dateOffsetLike: DurationLike = 0,
        dateOptions: DateTimeOptions = {},
    ) {
        super();

        folder = folder.trim();
        const dateOffset = Duration.fromDurationLike(dateOffsetLike);
        const intervalDuration = Duration.fromDurationLike(intervalDurationLike);

        assert(folder.length > 0, "folder must be non-empty");
        assert(dateFormat.length > 0, "dateFormat must be non-empty");
        assert(dateOffset.isValid, "dateOffset must be valid");
        assert(intervalDuration.isValid && intervalDuration.valueOf() !== 0, "intervalDuration must be non-zero");

        this.folder = folder;
        this.dateFormat = dateFormat;
        this.dateOffset = dateOffset;
        this.intervalDuration = intervalDuration;
        this.dateOptions = dateOptions;
    }

    /**
     * Used to accurately enable date-based queries on collections and to look up "neighboring" files.
     * @param filePath - the path to check.
     * @returns the {@link Interval} corresponding to the file, otherwise an invalid interval.
     */
    public override getIntervalOf(filePath: string): IntervalMaybeValid {
        const path = parse(filePath);
        if (path.dir !== this.folder) {
            return Interval.invalid(`invalid interval folder`, `"${filePath}" is not in "${this.folder}"`);
        }
        const date = DateTime.fromFormat(path.name, this.dateFormat, this.dateOptions);
        if (!date.isValid) {
            return Interval.invalid(`invalid interval filename`, `${date.invalidReason} ${date.invalidExplanation}`);
        }
        return Interval.after(date.plus(this.dateOffset), this.intervalDuration);
    }
}
