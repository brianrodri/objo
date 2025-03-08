import assert from "assert";
import { attempt, isError } from "lodash";
import { DateTime, DateTimeOptions, Duration, DurationLike, Interval, IntervalMaybeValid } from "luxon";
import { parse } from "path";

import { assertValid } from "@/util/luxon-utils";

import { DateBasedCollection } from "./schema";
import { sanitizeFolder } from "./util";

/** Configuration options for {@link PeriodicNotes}. */
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
 * @see {@link https://github.com/liamcain/obsidian-periodic-notes}
 *
 * A {@link DateBasedCollection} where each file corresponds to a unique {@link Interval} of time.
 * Intended to handle Obsidian's built-in "Daily Notes" plugin and the more-comprehensive "Periodic Notes" community
 * plugin. As a consequence, all files in the collection must be placed in the same folder.
 *
 * TODO: Is it worth supporting files organized into different folders?
 */
export class PeriodicNotes extends DateBasedCollection implements PeriodicNotesConfig<true> {
    /** The folder containing all of the notes. */
    public readonly folder: string;

    /**
     * The format used to parse a {@link DateTime} from file names.
     * @see {@link https://moment.github.io/luxon/#/parsing?id=table-of-tokens}
     */
    public readonly dateFormat: string;

    /** Luxon options used when parsing {@link DateTime}s from file names. */
    public readonly dateOptions: DateTimeOptions;

    /**
     * The {@link Duration} of each file's corresponding {@link Interval}.
     * @example
     * Daily notes should use a duration of `{ days: 1 }`.
     */
    public readonly intervalDuration: Duration<true>;

    /**
     * Offset between the file's _parsed_ date and the corresponding {@link Interval}'s _start_ date. May be negative.
     * @example
     * Sprint notes may use ISO weeks as their {@link dateFormat}, for example: `2025-W10.md`.
     * If sprints _actually_ begin on Thursdays rather than Mondays, then we can adjust the interval with `{ days: 3 }`.
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
            return Interval.invalid("invalid folder", `"${filePath}" is not in "${this.folder}"`);
        }
        const parsedDate = DateTime.fromFormat(parsedPath.name, this.dateFormat, this.dateOptions);
        if (!parsedDate.isValid) {
            return Interval.invalid("invalid filename", `${parsedDate.invalidReason} ${parsedDate.invalidExplanation}`);
        }
        return Interval.after(parsedDate.plus(this.intervalOffset), this.intervalDuration);
    }
}

/**
 * @param config - the config to validate.
 * @throws if any of the config's properties are invalid.
 * @returns a valid config.
 */
function validated(config: PeriodicNotesConfig<false>): PeriodicNotesConfig<true> {
    const folder = sanitizeFolder(config.folder);
    const dateFormat = config.dateFormat;
    const dateOptions = config.dateOptions ?? {};
    const intervalDuration = Duration.fromDurationLike(config.intervalDuration);
    const intervalOffset = Duration.fromDurationLike(config.intervalOffset ?? 0);

    const errors = [
        attempt(() => assert(folder.length > 0, "folder must be non-empty")),
        attempt(() => assert(dateFormat.length > 0, "date format must be non-empty")),
        attempt(() => assertValid(intervalOffset, "interval offset is invalid")),
        attempt(() => assertValid(intervalDuration, "interval duration is invalid")),
        attempt(() => assert(intervalDuration.valueOf() !== 0, "interval duration must not be zero")),
    ].filter(isError);

    if (errors.length > 0) {
        const indentedErrors = errors.map((error) => `${error.name}: ${error.message}`.replace(/^/gm, "\t"));
        throw new AggregateError(errors, ["invalid config", ...indentedErrors].join("\n"));
    }
    return { folder, dateFormat, dateOptions, intervalDuration, intervalOffset };
}
