import { ComponentType, PropsWithChildren } from "preact/compat";

export interface NestedProps {
    components: readonly ComponentType[];
}

export function Nested({ children, components }: PropsWithChildren<NestedProps>) {
    return components.reduceRight((inner, NextOuter) => <NextOuter>{inner}</NextOuter>, children);
}
