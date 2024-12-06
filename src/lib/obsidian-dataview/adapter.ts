import { DataviewApi, getAPI, isPluginEnabled } from "@/lib/obsidian-dataview/types";
import { Plugin } from "@/lib/obsidian/types";
import { Task } from "@/data/task";
import { mergeTasks } from "@/utils/merge-tasks";
import { parseEmojis } from "@/utils/parse-emojis";

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

    public getTasks(query: string, originFile?: string): Task[] {
        return [...this.dv.pages(query, originFile)].flatMap((page) =>
            [...page.file.tasks].map((task) =>
                mergeTasks(parseEmojis(task.text), {
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
                    dates: {
                        scheduled: page.file.day,
                    },
                    tags: new Set(task.tags),
                }),
            ),
        );
    }
}
