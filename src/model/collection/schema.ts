import { Interval, IntervalMaybeValid } from "luxon";

export abstract class Collection {
    public abstract includes(filePath: string): boolean;
    // TODO: Would this make more sense in its own interface?
    public getIntervalOf(filePath: string): IntervalMaybeValid {
        return Interval.invalid(`interval not implemented`, `"${filePath}" was ignored`);
    }
}
