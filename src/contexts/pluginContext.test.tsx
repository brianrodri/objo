import { render } from "@testing-library/preact";
import { expect, test } from "vitest";

import { Stringify } from "@/components/stringify";
import ObjoPlugin from "@/plugin";

import { PluginContext, PluginProvider } from "./pluginContext";

test("context from within provider", () => {
    const { container } = render(
        <PluginProvider plugin={{} as ObjoPlugin}>
            <Stringify context={PluginContext} />
        </PluginProvider>,
    );

    expect(container.textContent).toEqual("{}");
});

test("context outside of provider", () => {
    const { container } = render(<Stringify context={PluginContext} />);

    expect(container.textContent).toEqual("");
});
