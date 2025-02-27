/**
 * Union of all dot-separated paths in T.
 *
 * ```ts
 * type Obj = { a: { b: { c: string } } };
 *
 * type ObjPaths = PathOf<Obj>;
 * //   ^? type ObjPaths = "a" | "a.b" | "a.b.c"
 * ```
 */
export type PathOf<T> =
    T extends object ?
        { [K in keyof T]-?: K extends string | number ? `${K}` | `${K}.${PathOf<T[K]>}` : never }[keyof T]
    :   never;
