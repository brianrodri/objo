import { render } from "@testing-library/preact";
import { FunctionalComponent, createContext } from "preact";
import { expect, test } from "vitest";
import { ContextStringifier } from "../util/contextStringifier";
import { Nested } from "./nested";

test("supports providers", () => {
    const TestContext = createContext(0);

    const { container } = render(
        <>
            <ContextStringifier context={TestContext} />
            <Nested components={[TestContext.Provider]} mergedProps={{ value: 1 }}>
                <ContextStringifier context={TestContext} />
            </Nested>
            <ContextStringifier context={TestContext} />
        </>,
    );

    expect(container.textContent).toEqual("010");
});

test("supports components with empty props", () => {
    const components: FunctionalComponent[] = [({ children }) => <>outer {children} outer</>, () => <>inner</>];

    const { container } = render(<Nested components={components} />);

    expect(container.textContent).toEqual("outer inner outer");
});
