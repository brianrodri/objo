import { DeepPartial } from "utility-types";

import { DataviewMarkdownTask } from "@/lib/obsidian-dataview/types";
import { Task } from "@/model/task/schema";

export function adaptDataviewMarkdownTask(task: DataviewMarkdownTask): DeepPartial<Task> {
    return {
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
    };
}
