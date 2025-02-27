import { Interval, IntervalMaybeValid } from "luxon";

export abstract class Collection {
    public abstract get id(): string;
    public abstract includes(filePath: string): boolean;
    public getIntervalOf(filePath: string): IntervalMaybeValid {
        return Interval.invalid(`interval of ${this.id} not implemented`, `"${filePath}" was ignored`);
    }
}
