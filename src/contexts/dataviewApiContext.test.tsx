import { render } from "@testing-library/preact";
import { getAPI } from "obsidian-dataview";
import { expect, test, vi } from "vitest";

import { Stringify } from "@/components/stringify";

import { DataviewApiContext, DataviewApiProvider } from "./dataviewApiContext";

vi.mock("obsidian-dataview", () => ({ getAPI: vi.fn() }));

test("context from within provider", () => {
    vi.mocked(getAPI).mockReturnValue({ abc: 123 });

    const { container } = render(
        <DataviewApiProvider>
            <Stringify context={DataviewApiContext} />
        </DataviewApiProvider>,
    );

    expect(container.textContent).toEqual('{"abc":123}');
});

test("context outside of provider", () => {
    const { container } = render(<Stringify context={DataviewApiContext} />);

    expect(container.textContent).toEqual("");
});
