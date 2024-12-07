import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { DeepPartial } from "utility-types";
import { Task } from "@/data/task";
import { byStartTime } from "@/utils/task-sort-utils";
import { sortBy } from "lodash";

describe("Sorting tasks", () => {
    it("should sort by start time", () => {
        const unorderedTasks: DeepPartial<Task>[] = [
            { times: { start: DateTime.fromISO("13:00") } },
            { times: { start: DateTime.fromISO("09:00") } },
            { times: { start: DateTime.fromISO("20:00") } },
            { times: { start: DateTime.fromISO("16:30") } },
        ];

        expect(sortBy(unorderedTasks, byStartTime)).toEqual([
            { times: { start: DateTime.fromISO("09:00") } },
            { times: { start: DateTime.fromISO("13:00") } },
            { times: { start: DateTime.fromISO("16:30") } },
            { times: { start: DateTime.fromISO("20:00") } },
        ]);
    });

    it("should place invalid starts at the end", () => {
        const unorderedTasks: DeepPartial<Task>[] = [
            { times: { start: DateTime.invalid("uh-oh!") } },
            { times: { start: DateTime.fromISO("13:00") } },
            { times: { start: DateTime.fromISO("09:00") } },
            { times: { start: DateTime.fromISO("20:00") } },
        ];

        expect(sortBy(unorderedTasks, byStartTime)).toEqual([
            { times: { start: DateTime.fromISO("09:00") } },
            { times: { start: DateTime.fromISO("13:00") } },
            { times: { start: DateTime.fromISO("20:00") } },
            { times: { start: DateTime.invalid("uh-oh!") } },
        ]);
    });
});
