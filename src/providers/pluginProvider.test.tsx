import { render } from "@testing-library/preact";
import { expect, test } from "vitest";
import ObjoPlugin from "../main";
import { PluginContext } from "../types/pluginContext";
import { ContextStringifier } from "../util/contextStringifier";
import { PluginProvider } from "./pluginProvider";

test("context from within provider", () => {
    const { container } = render(
        <PluginProvider plugin={{} as ObjoPlugin}>
            <ContextStringifier context={PluginContext} />
        </PluginProvider>,
    );

    expect(container.textContent).toEqual("{}");
});

test("context outside of provider", () => {
    const { container } = render(<ContextStringifier context={PluginContext} />);

    expect(container.textContent).toEqual("");
});
