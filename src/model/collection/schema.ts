import { IntervalMaybeValid } from "luxon";

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
}

export abstract class DateBasedCollection extends Collection {
    /**
     * Used to accurately enable date-based queries on collections and to look up "neighboring" files.
     * @param filePath - the path to check.
     * @returns the valid interval corresponding to the file, otherwise an invalid interval.
     */
    public abstract getIntervalOf(filePath: string): IntervalMaybeValid;

    public override includes(filePath: string): boolean {
        return this.getIntervalOf(filePath).isValid;
    }
}
