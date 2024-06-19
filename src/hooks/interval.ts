import { Duration, DurationLike } from "luxon";
import { useEffect, useState } from "preact/compat";

export function useInterval<T>(valueSupplier: () => T, interval: DurationLike = { seconds: 1 }) {
    const [value, setValue] = useState(valueSupplier);
    const intervalMs = Duration.fromDurationLike(interval).toMillis();

    useEffect(() => {
        const i = setInterval(() => setValue(valueSupplier()), intervalMs);
        return () => clearInterval(i);
    }, [valueSupplier, intervalMs]);

    return value;
}
