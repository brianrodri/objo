import { IntervalMaybeValid } from "luxon";

/** Interface for Bullet Journal collections that provide efficient query functions. */
export abstract class Collection {
    /**
     * @param filePath - the path to check.
     * @returns whether the file at the given path belongs to this collection.
     */
    public abstract includes(filePath: string): boolean;
}

/** A {@link Collection} where each note corresponds to a unique {@link Interval} of time. */
export abstract class DateBasedCollection extends Collection {
    /**
     * @param filePath - the path to check.
     * @returns the interval corresponding to the file, otherwise an invalid interval.
     */
    public abstract getIntervalOf(filePath: string): IntervalMaybeValid;

    public override includes(filePath: string): boolean {
        return this.getIntervalOf(filePath).isValid;
    }
}
