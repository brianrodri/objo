import { DateTime } from "luxon";

export function setTime(date: DateTime, time: DateTime): DateTime {
    if (date.isValid && time.isValid) {
        return date.startOf("day").plus(time.diff(time.startOf("day")));
    }
    return date;
}
