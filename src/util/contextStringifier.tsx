import { Context, useContext } from "preact/compat";

export interface ContextStringifierProps<T> {
    context: Context<T>;
    replacer?: Parameters<typeof JSON.stringify>[1];
    space?: Parameters<typeof JSON.stringify>[2];
}

/** Renders the JSON stringified value of a context. */
export function ContextStringifier<T>({ context, replacer, space }: ContextStringifierProps<T>) {
    return <>{JSON.stringify(useContext(context), replacer, space)}</>;
}
