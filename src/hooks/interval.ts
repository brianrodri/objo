import { useEffect, useState } from "preact/compat";

export function useInterval<T>(valueSupplier: () => T, intervalMs: number = 1000) {
    const [value, setValue] = useState(valueSupplier);

    useEffect(() => {
        const i = setInterval(() => setValue(valueSupplier()), intervalMs);
        return () => clearInterval(i);
    }, [valueSupplier, intervalMs]);

    return value;
}
