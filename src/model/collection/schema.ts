import { Interval, IntervalMaybeValid } from "luxon";

/**
 * Interface for Bullet Journal collections.
 *
 * Answers common questions required by other Objo views and models with regards to how to interpret files belonging to
 * the collection.
 */
export abstract class Collection {
    /**
     * @param filePath - the path to check.
     * @returns whether the file at the given path belongs to this collection.
     */
    public abstract includes(filePath: string): boolean;

    /**
     * @param filePath - the path to check.
     * @returns an interval corresponding to the file when it belongs in this collection, otherwise an invalid interval.
     *
     * Used to accurately enable date-based queries on collections and to look up "neighboring" files.
     */
    public getIntervalOf(filePath: string): IntervalMaybeValid {
        return Interval.invalid(`interval not implemented`, `"${filePath}" was ignored`);
    }
}
