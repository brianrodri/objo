import { DataviewApi, SMarkdownPage, STask, getAPI, isPluginEnabled } from "@/lib/obsidian-dataview/types";
import { EventRef, MetadataCache, Plugin, TAbstractFile, TFile } from "@/lib/obsidian/types";
import { OverloadedParameters4 } from "@/utils/type-utils";
import { Task } from "@/data/task";
import { mergeTaskParts } from "@/data/merge-task-parts";
import { parseTaskEmojis } from "@/data/parse-task-emojis";

type MetadataCacheOnFunctionParameters = OverloadedParameters4<MetadataCache["on"]>;

export class Dataview {
    private constructor(
        private readonly plugin: Plugin,
        private readonly dv: DataviewApi,
    ) {}

    /** IMPORTANT: Must be called from within `onLayoutReady` callback, otherwise the plugin will freeze! */
    public static async getReady(plugin: Plugin): Promise<Dataview> {
        return new Promise<Dataview>((resolve, reject) => {
            if (!isPluginEnabled(plugin.app)) {
                reject(new Error("obsidian-dataview is not installed and/or enabled"));
            } else {
                const api = getAPI(plugin.app);
                if (!api) {
                    reject(new Error("obsidian-dataview could not be loaded"));
                } else if (api.index.initialized) {
                    resolve(new Dataview(plugin, api));
                } else {
                    const dv = new Dataview(plugin, api);
                    plugin.registerEvent(dv.on("dataview:index-ready", () => resolve(dv)));
                }
            }
        });
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */

    public on(name: "dataview:index-ready", callback: () => void, ctx?: any): EventRef;

    public on(
        name: "dataview:metadata-change",
        callback:
            | ((name: "delete", file: TFile) => void)
            | ((name: "rename", file: TAbstractFile, oldPath: string) => void)
            | ((name: "update", file: TFile) => void),
        ctx?: any,
    ): EventRef;

    public on<Name extends MetadataCacheOnFunctionParameters[0]>(
        name: Name,
        callback: MetadataCache["on"] extends (name: Name, callback: infer F, ctx?: any) => EventRef ? F : never,
        ctx?: any,
    ): EventRef;

    public on(name: string, callback: (...args: any[]) => any, ctx?: any): EventRef {
        // @ts-expect-error - Rely on overloads for errors.
        return this.plugin.app.metadataCache.on(name, callback, ctx);
    }

    /* eslint-enable @typescript-eslint/no-explicit-any */

    public getPages(query: string, originFile?: string): SMarkdownPage[] {
        return [...this.dv.pages(query, originFile)];
    }

    public getTasks(query: string, originFile?: string): Task[] {
        return this.getPages(query, originFile).flatMap((page) => {
            return [...page.file.tasks].map((task) => this.extractTaskFields(page, task));
        });
    }

    private extractTaskFields(page: SMarkdownPage, task: STask): Task {
        return mergeTaskParts(parseTaskEmojis(task.text), {
            dates: {
                scheduled: page.file.day,
            },
            status: {
                symbol: task.status,
                type:
                    task.fullyCompleted ? "DONE"
                    : task.checked ? "CANCELLED"
                    : "OPEN",
            },
            source: {
                type: "PAGE",
                path: task.path,
                name: task.section.fileName(),
                section: task.section.subpath,
                lineNumber: task.line,
                startByte: task.position.start.offset,
                stopByte: task.position.end.offset,
                obsidianHref: task.section.obsidianLink(),
            },
            tags: new Set(task.tags),
        });
    }
}
