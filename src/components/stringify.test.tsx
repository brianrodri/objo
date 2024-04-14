import { render } from "@testing-library/preact";
import { createContext } from "preact/compat";
import { expect, test } from "vitest";
import { Stringify } from "./stringify";

const TestContext = createContext({ abc: 123 });

test("stringify context", () => {
    const { container } = render(<Stringify context={TestContext} />);

    expect(container.textContent).toEqual(JSON.stringify({ abc: 123 }));
});
