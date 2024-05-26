import { Context, useContext, useMemo } from "preact/compat";

export interface StringifyProps<T> {
    context: Context<T>;
    replacer?: Parameters<typeof JSON.stringify>[1];
    space?: Parameters<typeof JSON.stringify>[2];
}

/** Renders the JSON stringified value of a context. */
export function Stringify<T>({ context, replacer, space }: StringifyProps<T>) {
    const value = useContext(context);
    const string = useMemo(() => JSON.stringify(value, replacer, space), [value, replacer, space]);
    return <>{string}</>;
}
