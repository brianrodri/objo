import { render } from "@testing-library/preact";
import { expect, test } from "vitest";
import ObjoPlugin from "../main";
import { PluginContext } from "../types/pluginContext";
import { ContextStringifier } from "../util/contextStringifier";
import { PluginProvider } from "./pluginProvider";

test("plugin provider", () => {
    const { container } = render(
        <PluginProvider plugin={123 as unknown as ObjoPlugin}>
            <ContextStringifier context={PluginContext} />
        </PluginProvider>,
    );

    expect(container.textContent).toEqual(JSON.stringify({ plugin: 123 }));
});
