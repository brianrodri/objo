import { DateTime, DurationLike } from "luxon";
import { useCallback } from "preact/compat";

import { PeriodicLog } from "@/collections/periodicLog";
import { useObjoContext } from "@/compat/pluginContext";
import { useInterval } from "@/hooks/interval";

const REFRESH_INTERVAL: DurationLike = { minutes: 1 };

export function Header() {
    const { collection } = useObjoContext();
    const getNow = useCallback(() => DateTime.now().startOf(collection.unit), [collection.unit]);
    const now = useInterval(getNow, REFRESH_INTERVAL);

    return <h1>{getHeaderContent(now, collection)}</h1>;
}

function getHeaderContent(now: DateTime, collection: PeriodicLog) {
    const { date, unit, headerDateFormat = collection.fileNameDateFormat } = collection;

    switch (date.diff(now, unit).as(unit)) {
        case -1:
            return unit === "day" ? "Yesterday" : `Last ${unit}`;
        case 0:
            return unit === "day" ? "Today" : `This ${unit}`;
        case 1:
            return unit === "day" ? "Tomorrow" : `Next ${unit}`;
        default:
            return date.toFormat(headerDateFormat);
    }
}
