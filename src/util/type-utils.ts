/**
 * The union of all dot-separated paths in an object rescursively.
 *
 * @example
 *
 * ```typescript
 * type Obj = { a: { b: { c: string } } };
 *
 * type ObjPaths = PathsOf<Obj>;
 * //   ^? type ObjPaths = "a" | "a.b" | "a.b.c"
 * ```
 */
export type PathsOf<T> =
    T extends object ?
        { [K in keyof T]-?: K extends string | number ? `${K}` | `${K}.${PathsOf<T[K]>}` : never }[keyof T]
    :   never;
