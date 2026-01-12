import { vi } from "vitest";

export type { EventRef, MetadataCache, Pos, TAbstractFile, TFile } from "obsidian";

export const App = vi.fn();
export const Component = vi.fn();
export const MarkdownRenderer = { render: vi.fn() };
export const Plugin = vi.fn();
