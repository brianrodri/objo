import { render } from "@testing-library/preact";
import { getAPI } from "obsidian-dataview";
import { expect, test, vi } from "vitest";
import { DataviewContext } from "../types/dataviewContext";
import { ContextStringifier } from "../util/contextStringifier";
import { DataviewProvider } from "./dataviewProvider";

vi.mock("obsidian-dataview", () => ({ getAPI: vi.fn() }));

test("dataview provider", () => {
    vi.mocked(getAPI).mockReturnValue(123);

    const { container } = render(
        <DataviewProvider>
            <ContextStringifier context={DataviewContext} />
        </DataviewProvider>,
    );

    expect(getAPI).toHaveBeenCalled();
    expect(container.textContent).toEqual("123");
});
