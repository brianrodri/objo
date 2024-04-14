import { ComponentType, VNode } from "preact";
import { PropsWithChildren } from "preact/compat";

export interface NestedProps<P> {
    components: ComponentType<P>[];
    mergedProps?: P;
}

export function Nested<P>({ children, components, mergedProps = {} as P }: PropsWithChildren<NestedProps<P>>) {
    return components.reduceRight((child, C) => <C {...mergedProps}>{child}</C>, children) as VNode;
}
