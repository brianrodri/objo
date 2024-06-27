import { PeriodicLog } from "@/collections/periodicLog";
import { Markdown } from "@/compat/markdown";
import { useObjoContext } from "@/compat/pluginContext";

export function CompletedTasks() {
    const { collection } = useObjoContext();

    const md = `
> [!todo] **Completed Tasks**
> \`\`\`dataview
> ${getDataviewQuery(collection)}
> \`\`\`
`;

    return <Markdown md={md} />;
}

function getDataviewQuery({ interval }: PeriodicLog) {
    return fixWhitespace(`
        TASK
        FROM -#index
        WHERE completed
          AND completion >= date(${interval.start.toISODate()})
          AND completion < date(${interval.end.toISODate()})
        AND file.path != this.file.path
        GROUP BY file.folder + "/" + file.name AS key
        SORT key DESC
    `);
}

function fixWhitespace(query: string): string {
    return query.trim().split(/\s+/).join(" ");
}
