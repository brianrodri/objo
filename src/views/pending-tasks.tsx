import { PeriodicLog } from "@/collections/periodicLog";
import { Markdown } from "@/compat/markdown";
import { useObjoContext } from "@/compat/pluginContext";

export function PendingTasks() {
    const { collection } = useObjoContext();

    const md = `
> [!todo] **Carryover**
> \`\`\`dataview
> ${getDataviewQuery(collection)}
> \`\`\`
`;

    return <Markdown md={md} />;
}

function getDataviewQuery({ date, unit }: PeriodicLog) {
    const lowerBound = date.startOf(unit);
    const upperBound = lowerBound.plus({ [unit]: 1 });

    return fixWhitespace(`
        TASK
        WHERE !checked
        AND (!date(file.name) OR date(file.name) < date(${lowerBound.toISODate()}))
        AND (!scheduled OR scheduled < date(${upperBound.toISODate()}))
        AND (!start OR start < date(${upperBound.toISODate()}))
        AND file.path != this.file.path
        GROUP BY file.folder + "/" + file.name AS key
        SORT key DESC
    `);
}

function fixWhitespace(query: string): string {
    return query.trim().split(/\s+/).join(" ");
}
