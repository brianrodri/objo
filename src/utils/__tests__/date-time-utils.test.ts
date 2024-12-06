import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";

import { setTime } from "../date-time-utils";

describe("setTime", () => {
    it("should set the time of a date", () => {
        const date = DateTime.fromISO("2024-12-06");
        const time = DateTime.fromISO("13:00");

        expect(setTime(date, time)).toEqual(DateTime.fromISO("2024-12-06T13:00"));
        expect(date).toEqual(DateTime.fromISO("2024-12-06T00:00"));
    });

    it("should do nothing if time is invalid", () => {
        const date = DateTime.fromISO("2024-12-06");
        const time = DateTime.invalid("uh-oh!");

        expect(setTime(date, time)).toEqual(date);
    });

    it("should do nothing if date is invalid", () => {
        const date = DateTime.invalid("uh-oh!");
        const time = DateTime.fromISO("13:00");

        expect(setTime(date, time)).toEqual(date);
    });
});
