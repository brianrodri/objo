import assert from "assert";
import { kebabCase } from "lodash";
import { DateTime, DateTimeOptions, Duration, DurationLike, Interval, IntervalMaybeValid } from "luxon";
import { parse } from "path";

import { Collection } from "./schema";

export class PeriodicLog extends Collection {
    public readonly id: string;
    public readonly folder: string;
    public readonly dateFormat: string;
    public readonly dateOffset: Duration<true>;
    public readonly intervalDuration: Duration<true>;
    public readonly dateOptions: DateTimeOptions;

    public constructor(
        id: string,
        folder: string,
        dateFormat: string,
        intervalDurationLike: DurationLike,
        dateOffsetLike: DurationLike = 0,
        dateOptions: DateTimeOptions = {},
    ) {
        super();

        id = id.trim();
        folder = folder.trim();
        const dateOffset = Duration.fromDurationLike(dateOffsetLike);
        const intervalDuration = Duration.fromDurationLike(intervalDurationLike);

        assert(id.length > 0, "id must be non-empty");
        assert(folder.length > 0, "folder must be non-empty");
        assert(dateFormat.length > 0, "dateFormat must be non-empty");
        assert(dateOffset.isValid, "dateOffset must be valid");
        assert(intervalDuration.isValid && intervalDuration.valueOf() !== 0, "intervalDuration must be non-zero");

        this.id = kebabCase(id);
        this.folder = folder;
        this.dateFormat = dateFormat;
        this.dateOffset = dateOffset;
        this.intervalDuration = intervalDuration;
        this.dateOptions = dateOptions;
    }

    public override includes(filePath: string): boolean {
        return this.getIntervalOf(filePath).isValid;
    }

    public override getIntervalOf(filePath: string): IntervalMaybeValid {
        const path = parse(filePath);
        if (path.dir !== this.folder) {
            return Interval.invalid(`invalid ${this.id} folder`, `"${filePath}" is not in "${this.folder}"`);
        }
        const date = DateTime.fromFormat(path.name, this.dateFormat, this.dateOptions);
        if (!date.isValid) {
            return Interval.invalid(`invalid ${this.id} filename`, `${date.invalidExplanation} ${date.invalidReason}`);
        }
        return Interval.after(date.plus(this.dateOffset), this.intervalDuration);
    }
}
