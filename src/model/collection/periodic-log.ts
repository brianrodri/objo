import assert from "assert";
import { DateTime, DateTimeOptions, Duration, DurationLike, Interval, IntervalMaybeValid } from "luxon";
import { parse } from "path";

import { Collection } from "./schema";

/**
 * Represents a collection of date-based files in a folder. Each file corresponds to a specific interval of time.
 * Designed to handle Obsidian's built-in "Daily Log" plugin and the more-comprehensive "Periodic log" community plugin.
 */
export class PeriodicLog extends Collection {
    /**
     * The folder containing all of the notes.
     * TODO: Is it worth supporting files organized into different folders?
     */
    public readonly folder: string;
    /**
     * Luxon format used to parse dates from the file's name.
     * @see {@link https://moment.github.io/luxon/#/parsing?id=table-of-tokens}
     */
    public readonly dateFormat: string;
    /**
     * Offset between a file's parsed date and the start of its corresponding interval.
     * Used to offset weekly/monthly/etc. collections to a more-granular date.
     * For example, a sprint log may use ISO weeks as titles (i.e. starts on Monday), but the sprint actually _begins_
     * on Thursdays.
     */
    public readonly dateOffset: Duration<true>;
    /** The length corresponding to each file's interval. For example, a daily log would use a duration of one day. */
    public readonly intervalDuration: Duration<true>;
    /** Luxon options used when parsing dates from file names. */
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

    /** {@inheritDoc model/collection/schema.Collection#includes} */
    public override includes(filePath: string): boolean {
        return this.getIntervalOf(filePath).isValid;
    }

    /** {@inheritDoc model/collection/schema.Collection#getIntervalOf} */
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
