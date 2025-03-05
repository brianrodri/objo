import assert from "assert";
import { DateTime, DateTimeOptions, Duration, DurationLike, Interval, IntervalMaybeValid } from "luxon";
import { parse } from "path";

import { Collection } from "./schema";

/**
 * Represents a collection of files in a folder where each file represents a specific interval of time.
 * Designed to handle Obsidian's built-in "Daily Log" plugin and the more-comprehensive "Periodic log" community plugin.
 */
export class PeriodicLog extends Collection {
    /** The folder containing all of the notes. Periodic logs do not support files organized into different folders. */
    public readonly folder: string;
    /**
     * Luxon format used to parse dates from the file's name.
     * @see {@link https://moment.github.io/luxon/#/parsing?id=table-of-tokens}
     */
    public readonly dateFormat: string;
    /**
     * The offset of each file interval with respect to the date parsed from its file name.
     * Useful for weekly/monthly/etc. collections that start on a more-granular time.
     * For example a sprint log that uses ISO weeks as titles, but actually _begin_ on Thursdays.
     */
    public readonly dateOffset: Duration<true>;
    /** The length of each file interval. For example, a daily log's duraation would be one day. */
    public readonly intervalDuration: Duration<true>;
    /** Luxon options for parsing DateTime from file names. */
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
