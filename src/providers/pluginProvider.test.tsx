import { render } from "@testing-library/preact";
import { expect, test } from "vitest";
import ObjoPlugin from "../main";
import { StringifyContext } from "../util/context";
import { PluginContext, PluginProvider } from "./pluginProvider";

test("plugin provider", () => {
    const { container } = render(
        <PluginProvider plugin={123 as unknown as ObjoPlugin}>
            <StringifyContext context={PluginContext} />
        </PluginProvider>,
    );

    expect(container.textContent).toEqual(JSON.stringify({ plugin: 123 }));
});
