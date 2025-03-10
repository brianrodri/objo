import { attempt, isError } from "lodash";

/**
 * Asserts that all items in an array pass the given assertion.
 * Throws an aggregate error with _all_ failures, rather than just the first one encountered.
 * @typeParam T - the type of each input item.
 * @typeParam Constrained - the constrained type of each input item.
 * @param items - The array of items to inspect.
 * @param assertion - Used to assert that an item is constrained.
 * @param message - Optional message to include if an assertion fails.
 * @throws aggregate error with items that failed the assertion.
 */
export function assertEach<T, Constrained extends T>(
    items: T[],
    assertion: (item: T) => asserts item is Constrained,
    message?: string,
): asserts items is Constrained[] {
    const failures = items
        .map((item) => attempt(() => assertion(item)))
        .map((error, index) => (error ? new Error(`invalid index ${index}: ${error.message}`) : null))
        .filter(isError);
    if (failures.length > 0) {
        const messageLines = [
            message ?? `assertion failed on ${failures.length} item(s)`,
            ...failures.map((error) => error.message.replace(/^/gm, "\t")),
        ];
        throw new AggregateError(failures, messageLines.join("\n"));
    }
}
