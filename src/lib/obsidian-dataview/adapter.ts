import { DataviewApi, SMarkdownPage, STask, getAPI, isPluginEnabled } from "@/lib/obsidian-dataview/types";
import { Plugin } from "@/lib/obsidian/types";
import { Task } from "@/data/task";
import { mergeTaskParts } from "@/data/merge-task-parts";
import { parseTaskEmojis } from "@/data/parse-task-emojis";

export class Dataview {
    private constructor(private readonly dv: DataviewApi) {}

    /** IMPORTANT: Must be called from within `onLayoutReady` callback, otherwise the plugin will freeze! */
    public static async getReady(plugin: Plugin): Promise<Dataview> {
        return new Promise<Dataview>((resolve, reject) => {
            if (!isPluginEnabled(plugin.app)) {
                reject(new Error("obsidian-dataview is not installed and/or enabled"));
            } else {
                const api: DataviewApi = getAPI(plugin.app);
                if (api?.index.initialized) {
                    resolve(new Dataview(api));
                } else {
                    plugin.registerEvent(
                        // @ts-expect-error - obsidian doesn't define types for third-party events.
                        plugin.app.metadataCache.on("dataview:index-ready", () => resolve(new Dataview(api))),
                    );
                }
            }
        });
    }

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
