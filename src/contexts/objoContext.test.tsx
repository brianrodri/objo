import { render } from "@testing-library/preact";
import { TFile } from "obsidian";
import { describe, expect, test } from "vitest";

import { Stringify } from "@/components/stringify";
import { DEFAULT_SETTINGS } from "@/types/settings";

import { ObjoContext, ObjoContextProvider, useObjoContext } from "./objoContext";

describe("ObjoContext", () => {
    const ContextConsumer = () => <Stringify value={useObjoContext()} />;

    test("returns context when all values are provided", () => {
        const context: ObjoContext = { file: {} as TFile, settings: DEFAULT_SETTINGS };

        const result = render(
            <ObjoContextProvider value={context}>
                <ContextConsumer />
            </ObjoContextProvider>,
        );

        expect(result.container.textContent).toEqual(JSON.stringify(context));
    });

    test("throws error when used outside of provider", () => {
        expect(() => render(<ContextConsumer />)).toThrowError();
    });
});
