import { Interval, IntervalMaybeValid } from "luxon";

/**
 * Interface for Bullet Journal collections. Answers common questions required by
 * other Objo views and models with regards to how to interpret files belonging to
 * the collection.
 */
export abstract class Collection {
    /**
     * @param filePath - the path to check.
     * @returns whether the file at the given path belongs in the collection.
     */
    public abstract includes(filePath: string): boolean;

    /**
     * @param filePath - the path to check.
     * @returns the file's corresponding interval, or an invalid interval if not applicable.
     */
    public getIntervalOf(filePath: string): IntervalMaybeValid {
        return Interval.invalid(`interval not implemented`, `"${filePath}" was ignored`);
    }
}
