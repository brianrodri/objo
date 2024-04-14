import { ComponentType, FunctionComponent } from "preact/compat";

export function makeNestedComponent(...components: readonly ComponentType[]): FunctionComponent {
    return ({ children }) => components.reduceRight((inner, Outer) => <Outer>{inner}</Outer>, <>{children}</>);
}
