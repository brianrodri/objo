import { render } from "@testing-library/preact";
import { createContext } from "preact/compat";
import { expect, test } from "vitest";
import { ContextStringifier } from "./contextStringifier";

const TestContext = createContext({ abc: 123 });

test("stringify context", () => {
    const { container } = render(<ContextStringifier context={TestContext} />);

    expect(container.textContent).toEqual(JSON.stringify({ abc: 123 }));
});
