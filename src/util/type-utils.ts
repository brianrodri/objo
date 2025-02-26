/**
 * Union of all possible dot-separated paths to a sub-field in T
 *
 * ```ts
 * type Obj = { a: { b: { c: string } } };
 *
 * type Paths = PathOf<Obj>;
 * //           ^? - "a" | "a.b" | "a.b.c"
 * ```
 */
export type PathOf<T> =
    T extends object ?
        { [K in keyof T]-?: K extends string | number ? `${K}` | `${K}.${PathOf<T[K]>}` : never }[keyof T]
    :   never;
