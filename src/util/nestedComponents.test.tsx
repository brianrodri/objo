import { render } from "@testing-library/preact";
import { expect, test } from "vitest";
import { nestedComponents } from "./nestedComponents";

test("supports components with empty props", () => {
    const TestComponent = nestedComponents(
        ({ children }) => <>outermost {children} outermost</>,
        ({ children }) => <>innermost {children} innermost</>,
    );

    const { container } = render(<TestComponent>inner</TestComponent>);

    expect(container.textContent).toEqual("outermost innermost inner innermost outermost");
});
