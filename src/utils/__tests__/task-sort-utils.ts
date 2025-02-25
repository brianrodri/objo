import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { DeepPartial } from "utility-types";
import { Task } from "@/data/tasks/task-model";
import { byStartTime } from "@/utils/task-sort-utils";
import { sortBy } from "lodash";

const TIME_INVALID = DateTime.invalid("uh-oh!");
const TIME_1300 = DateTime.fromISO("13:00");
const TIME_0900 = DateTime.fromISO("09:00");
const TIME_1630 = DateTime.fromISO("16:30");
const TIME_2000 = DateTime.fromISO("20:00");

describe("Sorting tasks", () => {
    it("should sort by start time", () => {
        const unorderedTasks: DeepPartial<Task>[] = [
            { times: { start: TIME_1300 } },
            { times: { start: TIME_0900 } },
            { times: { start: TIME_2000 } },
            { times: { start: TIME_1630 } },
        ];

        expect(sortBy(unorderedTasks, byStartTime)).toEqual([
            { times: { start: TIME_0900 } },
            { times: { start: TIME_1300 } },
            { times: { start: TIME_1630 } },
            { times: { start: TIME_2000 } },
        ]);
    });

    it("should place invalid starts at the end", () => {
        const unorderedTasks: DeepPartial<Task>[] = [
            { times: { start: TIME_INVALID } },
            { times: { start: TIME_1300 } },
            { times: { start: TIME_0900 } },
            { times: { start: TIME_2000 } },
        ];

        expect(sortBy(unorderedTasks, byStartTime)).toEqual([
            { times: { start: TIME_0900 } },
            { times: { start: TIME_1300 } },
            { times: { start: TIME_2000 } },
            { times: { start: TIME_INVALID } },
        ]);
    });
});
