import { ComponentType } from "preact/compat";

export function nestedComponents(...components: ComponentType[]): ComponentType {
    return components.reduce(
        (ParentComponent, NextComponent) =>
            ({ children }) => (
                <ParentComponent>
                    <NextComponent>{children}</NextComponent>
                </ParentComponent>
            ),
        ({ children }) => <>{children}</>,
    );
}
