import { Interval } from "luxon";

/**
 * A Bullet Journal collection.
 *
 * The interface answers the common questions asked by Bullet Journal views:
 * - How do I query for the notes?
 * - Do notes correspond to an interval of time, like a daily note?
 */
export interface Collection {
    /** Returns the unique vault-specific identifier of the collection. */
    getID(): string;

    /** Returns true if the file belongs to this collection. */
    includes(filePath: string): boolean;

    /** Returns the interval of time corresponding to the given note, or null if not applicable. */
    getNoteInterval(notePath: string): Interval | null;
}
