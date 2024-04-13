import { render } from "@testing-library/preact";
import { expect, test, vi } from "vitest";
import { DataviewApiContext } from "../types/dataviewApiContext";
import { ContextStringifier } from "../util/contextStringifier";
import { DataviewApiProvider } from "./dataviewApiProvider";

vi.mock("obsidian-dataview", () => ({ getAPI: vi.fn(() => ({ abc: 123 })) }));

test("context from within provider", () => {
    const { container } = render(
        <DataviewApiProvider>
            <ContextStringifier context={DataviewApiContext} />
        </DataviewApiProvider>,
    );

    expect(container.textContent).toEqual('{"abc":123}');
});

test("context outside of provider", () => {
    const { container } = render(<ContextStringifier context={DataviewApiContext} />);

    expect(container.textContent).toEqual("");
});
