import { DateTime } from "luxon";

export { DEFAULT_PRIORITY_VALUE, DEFAULT_TYPE_VALUE, TASK_WITH_DEFAULT_VALUES } from "./schema.const";

/** Objo-related metadata for the tasks in a user's vault. */
export interface Task {
    /** Metadata describing the actionable status of the task. */
    status: TaskStatus;
    /** Metadata describing where the task was extracted from. */
    source: TaskSource;
    /** Dates associated with the task. */
    dates: {
        /** When the task was cancelled. */
        cancelled: DateTime;
        /** When the task was created. */
        created: DateTime;
        /** When the task was completed. */
        done: DateTime;
        /** When the task is due. */
        due: DateTime;
        /** When the task is scheduled to be started. */
        scheduled: DateTime;
        /** When the task is able to be started. */
        start: DateTime;
    };
    /** The description of the task. */
    description: string;
    /** The priority of the task. Lower numbers represent higher priorities. */
    priority: number;
    /** The tags associated with this task. The leading hashtag ("#") is omitted. */
    tags: ReadonlySet<string>;
    /** An optional user-defined string that uniquely identifies this task across the vault. */
    id: string;
    /** The set of {@link Task.id}s that need to be completed before this task can be started. */
    dependsOn: ReadonlySet<string>;
}

/** Metadata about the actionable status of a task. */
export type TaskStatus =
    | {
          /** `"UNKNOWN"` is reserved for tasks that are invalid or unparsable. */
          type: "UNKNOWN";
      }
    | {
          /** The status of the task. Mirrors the status provided by the "obsidian-tasks" plugin. */
          type: "OPEN" | "DONE" | "CANCELLED" | "NON_TASK";
          /** The character inside the `[ ]` brackets on the line with the task. */
          symbol: string;
      };

/** Metadata about where a task was extracted/generated from. */
export type TaskSource =
    | {
          /** `"UNKNOWN"` is reserved for tasks that are invalid or unparsable. */
          type: "UNKNOWN";
      }
    | {
          /** Identifies where this task was extracted/generated from. */
          type: "PAGE";
          /** The full path of the file this task was taken from. */
          path: string;
          /** The name of the file this task was taken from, excluding its extension. */
          name: string;
          /** The section this task belongs to, if applicable. */
          section?: string;
          /** The line of the file this task shows up on. */
          lineNumber: number;
          /** The byte in the file this task begins at. */
          startByte: number;
          /** The byte in the file this task ends at. */
          stopByte: number;
          /** A URL to the file that Obsidian can open and understand. */
          obsidianHref: string;
      };
