import { render } from "@testing-library/preact";
import { ComponentType } from "preact/compat";
import { expect, test } from "vitest";

import { Nested } from "./nested";

test("nesting components", () => {
    const components: ComponentType[] = [
        ({ children }) => <>outer {children} outer</>,
        ({ children }) => <>inner {children} inner</>,
    ];

    const { container } = render(<Nested components={components}>innermost</Nested>);

    expect(container.textContent).toEqual("outer inner innermost inner outer");
});
