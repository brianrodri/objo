import { PeriodicLog } from "@/collections/periodicLog";
import { Markdown } from "@/compat/markdown";
import { useObjoContext } from "@/compat/pluginContext";

export function PendingTasks() {
    const { collection } = useObjoContext();

    const md = `
> [!todo] **Pending Tasks**
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
        WHERE !checked
        AND (!date(file.name) OR date(file.name) < date(${interval.start.toISODate()}))
        AND (!scheduled OR scheduled < date(${interval.end.toISODate()}))
        AND (!start OR start < date(${interval.end.toISODate()}))
        AND file.path != this.file.path
        GROUP BY file.folder + "/" + file.name AS key
        SORT key DESC
    `);
}

function fixWhitespace(query: string): string {
    return query.trim().split(/\s+/).join(" ");
}
