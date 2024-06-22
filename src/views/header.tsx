import { DateTime, DurationLike } from "luxon";

import { PeriodicLog } from "@/collections/periodicLog";
import { useObjoContext } from "@/compat/pluginContext";
import { useInterval } from "@/hooks/interval";

const REFRESH_INTERVAL: DurationLike = { minutes: 1 };

export function Header() {
    const now = useInterval(DateTime.now, REFRESH_INTERVAL);
    const { collection } = useObjoContext();

    return <h1>{getHeaderContent(now, collection)}</h1>;
}

function getHeaderContent(
    now: DateTime,
    { interval, duration, unit, label = unit, fileNameDateFormat, headerDateFormat = fileNameDateFormat }: PeriodicLog,
) {
    if (interval.contains(now)) {
        return unit === "day" ? "Today" : `This ${label}`;
    } else if (interval.contains(now.minus(duration))) {
        return unit === "day" ? "Yesterday" : `Last ${label}`;
    } else if (interval.contains(now.plus(duration))) {
        return unit === "day" ? "Tomorrow" : `Next ${label}`;
    } else {
        return interval.start.toFormat(headerDateFormat);
    }
}
