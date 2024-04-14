import { Context, useContext } from "preact/compat";

export interface StringifyProps<T> {
    context: Context<T>;
    replacer?: Parameters<typeof JSON.stringify>[1];
    space?: Parameters<typeof JSON.stringify>[2];
}

/** Renders the JSON stringified value of a context. */
export function Stringify<T>({ context, replacer, space }: StringifyProps<T>) {
    return <>{JSON.stringify(useContext(context), replacer, space)}</>;
}
