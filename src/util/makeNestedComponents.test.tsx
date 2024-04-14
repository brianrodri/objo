import { render } from "@testing-library/preact";
import { expect, test } from "vitest";
import { makeNestedComponent } from "./makeNestedComponents";

test("nesting components", () => {
    const NestedComponent = makeNestedComponent(
        ({ children }) => <>outer {children} outer</>,
        ({ children }) => <>inner {children} inner</>,
    );

    const { container } = render(<NestedComponent>innermost</NestedComponent>);

    expect(container.textContent).toEqual("outer inner innermost inner outer");
});
