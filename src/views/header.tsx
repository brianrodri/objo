import { DateTime, DurationLike } from "luxon";
import { useCallback } from "preact/compat";

import { PeriodicLog } from "@/collections/periodicLog";
import { useObjoContext } from "@/compat/pluginContext";
import { useInterval } from "@/hooks/interval";

const REFRESH_INTERVAL: DurationLike = { minutes: 1 };

export function Header() {
    const { collection } = useObjoContext();
    const getNow = useCallback(
        () => DateTime.now().startOf(collection.unit).plus(collection.offset),
        [collection.unit],
    );
    const now = useInterval(getNow, REFRESH_INTERVAL);

    return <h1>{getHeaderContent(now, collection)}</h1>;
}

function getHeaderContent(now: DateTime, collection: PeriodicLog) {
    const { interval, unit, label = unit, fileNameDateFormat, headerDateFormat = fileNameDateFormat } = collection;

    switch (interval.start.diff(now, unit).as(unit)) {
        case -1:
            return unit === "day" ? "Yesterday" : `Last ${label}`;
        case 0:
            return unit === "day" ? "Today" : `This ${label}`;
        case 1:
            return unit === "day" ? "Tomorrow" : `Next ${label}`;
        default:
            return interval.start.toFormat(headerDateFormat);
    }
}
