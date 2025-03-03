import { Interval, IntervalMaybeValid } from "luxon";

export abstract class Collection {
    public abstract includes(filePath: string): boolean;
    public getIntervalOf(filePath: string): IntervalMaybeValid {
        return Interval.invalid(`interval not implemented`, `"${filePath}" was ignored`);
    }
}
