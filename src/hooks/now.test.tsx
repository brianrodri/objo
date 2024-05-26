import { act, renderHook } from "@testing-library/preact";
import { DateTime, Duration } from "luxon";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { useNow } from "@/hooks/now";

const NOW = DateTime.now();

describe("useNow", () => {
    beforeEach(() => {
        vi.useFakeTimers().setSystemTime(NOW.toJSDate());
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("returns now", () => {
        const { result } = renderHook(() => useNow());

        expect(result.current).toEqual(NOW);
    });

    test.each([1000, 60000])("updates with configurable interval", (intervalMs) => {
        const { result } = renderHook(() => useNow(intervalMs));

        act(() => {
            vi.advanceTimersByTime(intervalMs - 1);
        });

        expect(result.current).toEqual(NOW);

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(result.current).toEqual(NOW.plus({ milliseconds: intervalMs }));
    });

    test("stops updating after unmount", () => {
        const { result, unmount } = renderHook(() => useNow());
        unmount();
        act(() => {
            vi.advanceTimersByTime(Duration.fromObject({ days: 1 }).as("milliseconds"));
        });

        expect(result.current).toEqual(NOW);
    });
});
