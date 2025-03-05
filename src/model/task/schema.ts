import { DateTime } from "luxon";

export {
    DEFAULT_DATETIME_VALUE,
    DEFAULT_PRIORITY_VALUE,
    DEFAULT_TYPE_VALUE,
    TASK_WITH_DEFAULT_VALUES,
} from "./schema.const";

export interface Task {
    status: TaskStatus;
    source: TaskSource;
    dates: {
        cancelled: DateTime;
        created: DateTime;
        done: DateTime;
        due: DateTime;
        scheduled: DateTime;
        start: DateTime;
    };
    times: {
        start: DateTime;
        end: DateTime;
    };
    description: string;
    priority: number;
    tags: ReadonlySet<string>;
    id: string;
    dependsOn: ReadonlySet<string>;
}

export type TaskStatus =
    | { type: "UNKNOWN" }
    | {
          type: "OPEN" | "DONE" | "CANCELLED" | "NON_TASK";
          symbol: string;
      };

export type TaskSource =
    | { type: "UNKNOWN" }
    | {
          type: "PAGE";
          path: string;
          name: string;
          section?: string;
          lineNumber: number;
          startByte: number;
          stopByte: number;
          obsidianHref: string;
      };
