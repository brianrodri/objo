import assert from "assert";
import { attempt, clone, isError } from "lodash";
import { DateTime, DateTimeOptions, Duration, DurationLike, Interval, IntervalMaybeValid } from "luxon";
import { parse } from "path";

import { assertValid, assertValidDateTimeFormat } from "@/util/luxon-utils";

import { DateBasedCollection } from "./schema";
import { stripTrailingSlash } from "./util";

/**
 * Intended to handle the popular "Periodic Notes" community plugin.
 * As a consequence, all files in the collection must be placed in the same folder.
 * @see {@link https://github.com/liamcain/obsidian-periodic-notes}
 */
export class PeriodicNotes extends DateBasedCollection implements PeriodicNotesConfig<true> {
    /** The folder containing all of the notes. TODO: Support files organized into different folders. */
    public readonly folder: string;

    /**
     * The format used to parse a {@link DateTime} from file names. Must work for both parsing and formatting.
     * @see {@link https://moment.github.io/luxon/#/parsing?id=table-of-tokens}
     */
    public readonly dateFormat: string;

    /** Luxon options used when parsing {@link DateTime}s from file names. */
    public readonly dateOptions: Readonly<DateTimeOptions>;

    /**
     * The {@link Duration} of each file's corresponding {@link Interval}.
     * Daily notes, for example, should use a duration of `{ days: 1 }`.
     */
    public readonly intervalDuration: Duration<true>;

    /**
     * Offset between the file's _parsed_ date and the corresponding {@link Interval}'s _start_ date. May be negative.
     * Sprint notes, for example, can use ISO weeks for {@link dateFormat} and {@link intervalOffset} for their weekday.
     */
    public readonly intervalOffset: Duration<true>;

    public constructor(config: PeriodicNotesConfig<boolean>) {
        super();
        const { folder, dateFormat, dateOptions, intervalDuration, intervalOffset } = validated(config);
        this.folder = folder;
        this.dateFormat = dateFormat;
        this.dateOptions = dateOptions;
        this.intervalDuration = intervalDuration;
        this.intervalOffset = intervalOffset;
    }

    /**
     * Used to accurately enable date-based queries on collections and to look up "neighboring" files.
     * @param filePath - the path to check.
     * @returns the {@link Interval} corresponding to the file, otherwise an invalid interval.
     */
    public override getIntervalOf(filePath: string): IntervalMaybeValid {
        const parsedPath = parse(filePath);
        if (parsedPath.dir !== this.folder) {
            return Interval.invalid("invalid folder", `"${filePath}" must be in "${this.folder}"`);
        }
        const parsedDate = DateTime.fromFormat(parsedPath.name, this.dateFormat, this.dateOptions);
        if (!parsedDate.isValid) {
            return Interval.invalid("invalid filename", `${parsedDate.invalidReason} ${parsedDate.invalidExplanation}`);
        }
        return Interval.after(parsedDate.plus(this.intervalOffset), this.intervalDuration);
    }
}

/**
 * Configuration options for {@link PeriodicNotes}.
 * @typeParam IsValidConfiguration - whether the configuration is valid.
 */
export type PeriodicNotesConfig<IsValidConfiguration extends boolean> =
    IsValidConfiguration extends true ?
        {
            /** {@inheritDoc PeriodicNotes.folder} */
            folder: string;
            /** {@inheritDoc PeriodicNotes.dateFormat} */
            dateFormat: string;
            /** {@inheritDoc PeriodicNotes.dateOptions} */
            dateOptions: DateTimeOptions;
            /** {@inheritDoc PeriodicNotes.intervalDuration} */
            intervalDuration: Duration<true>;
            /** {@inheritDoc PeriodicNotes.intervalOffset} */
            intervalOffset: Duration<true>;
        }
    :   {
            /** {@inheritDoc PeriodicNotes.folder} */
            folder: string;
            /** {@inheritDoc PeriodicNotes.dateFormat} */
            dateFormat: string;
            /** {@inheritDoc PeriodicNotes.dateOptions} */
            dateOptions?: DateTimeOptions;
            /** {@inheritDoc PeriodicNotes.intervalDuration} */
            intervalDuration: DurationLike;
            /** {@inheritDoc PeriodicNotes.intervalOffset} */
            intervalOffset?: DurationLike;
        };

/**
 * Validates and normalizes a PeriodicNotes configuration object.
 *
 * This function checks that:
 * - the folder path (after stripping any trailing slash) is non-empty,
 * - the date format is valid with the given date options,
 * - the interval duration is a valid, non-zero duration, and
 * - the interval offset is a valid duration.
 *
 * If any of these validations fail, an {@link AggregateError} is thrown containing details
 * about each issue. On success, a new configuration object with strictly defined properties is returned.
 * @param config - The configuration object to validate.
 * @returns A validated configuration object with normalized properties.
 * @throws If one or more configuration properties are invalid.
 */
function validated(config: PeriodicNotesConfig<false>): PeriodicNotesConfig<true> {
    const folder = stripTrailingSlash(config.folder);
    const dateFormat = config.dateFormat;
    const dateOptions = clone(config.dateOptions ?? {});
    const intervalDuration = Duration.fromDurationLike(config.intervalDuration);
    const intervalOffset = Duration.fromDurationLike(config.intervalOffset ?? 0);

    const errors = [
        attempt(() => assert(folder.length > 0, "folder must be non-empty")),
        attempt(() => assertValidDateTimeFormat(dateFormat, dateOptions)),
        attempt(() => assertValid(intervalDuration, "interval duration must be valid")),
        attempt(() => assert(intervalDuration.valueOf() !== 0, "interval duration must be non-zero")),
        attempt(() => assertValid(intervalOffset, "interval offset must be valid")),
    ].filter(isError);

    if (errors.length > 0) {
        const indentedMessages = errors.map((error) => `${error.name}: ${error.message}`.replace(/^/gm, "\t"));
        throw new AggregateError(errors, ["invalid config", ...indentedMessages].join("\n"));
    }

    return { folder, dateFormat, dateOptions, intervalDuration, intervalOffset };
}
