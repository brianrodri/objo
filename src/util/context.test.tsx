import { render } from "@testing-library/preact";
import { createContext } from "preact/compat";
import { expect, test } from "vitest";
import { StringifyContext } from "./context";

const TestContext = createContext({ abc: 123, def: 456 });

test.each([
    [undefined, undefined],
    [undefined, 4],
    [["abc"], "tabs"],
])("stringify context", (replacer, space) => {
    const { container } = render(<StringifyContext context={TestContext} replacer={replacer} space={space} />);

    expect(container.textContent).toEqual(JSON.stringify({ abc: 123 }, replacer, space));
});
