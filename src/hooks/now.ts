import { DateTime } from "luxon";
import { useEffect, useState } from "preact/compat";

export function useNow(intervalMs: number = 1000) {
    const [now, setNow] = useState(DateTime.now);

    useEffect(() => {
        const i = setInterval(() => setNow(DateTime.now()), intervalMs);
        return () => clearInterval(i);
    }, [intervalMs]);

    return now;
}
