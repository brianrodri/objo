/* eslint-disable @typescript-eslint/no-explicit-any */

export type OverloadedParameters4<T> =
    T extends (
        {
            (...args: infer A1): any;
            (...args: infer A2): any;
            (...args: infer A3): any;
            (...args: infer A4): any;
        }
    ) ?
        A1 | A2 | A3 | A4
    : T extends { (...args: infer A1): any; (...args: infer A2): any; (...args: infer A3): any } ? A1 | A2 | A3
    : T extends { (...args: infer A1): any; (...args: infer A2): any } ? A1 | A2
    : T extends (...args: infer A) => any ? A
    : any;
