import { Context, useContext, useMemo } from "preact/compat";

export type StringifyProps<T> = ({ value: T } | { context: Context<T> }) & {
    replacer?: Parameters<typeof JSON.stringify>[1];
    space?: Parameters<typeof JSON.stringify>[2];
};

/** Renders a JSON stringified value. */
export function Stringify<T>({ replacer, space, ...overloadedProps }: StringifyProps<T>) {
    const value = "value" in overloadedProps ? overloadedProps.value : useContext(overloadedProps.context);
    const string = useMemo(() => JSON.stringify(value, replacer, space), [value, replacer, space]);
    return <>{string}</>;
}
