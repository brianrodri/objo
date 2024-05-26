import { render } from "@testing-library/preact";
import { createContext } from "preact/compat";
import { expect, test } from "vitest";

import { Stringify } from "./stringify";

test("stringify context", () => {
    const context = createContext({ abc: 123 });
    const { container } = render(<Stringify context={context} />);

    expect(container.textContent).toEqual(JSON.stringify({ abc: 123 }));
});

test("stringify value", () => {
    const { container } = render(<Stringify value={{ abc: 123 }} />);

    expect(container.textContent).toEqual(JSON.stringify({ abc: 123 }));
});
