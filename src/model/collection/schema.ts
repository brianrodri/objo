import { Interval, IntervalMaybeValid } from "luxon";

/**
 * Interface for Bullet Journal collections.
 *
 * Provides efficient functions for common operations required by views and other models.
 */
export abstract class Collection {
    /**
     * @param filePath - the path to check.
     * @returns whether the file at the given path belongs to this collection.
     */
    public abstract includes(filePath: string): boolean;

    /**
     * Used to accurately enable date-based queries on collections and to look up "neighboring" files.
     * @param filePath - the path to check.
     * @returns the {@link Interval} corresponding to the file, otherwise an invalid interval.
     */
    public getIntervalOf(filePath: string): IntervalMaybeValid {
        return Interval.invalid(`interval not implemented`, `"${filePath}" was ignored`);
    }
}
