import { DateTime } from "luxon";

export {
    DEFAULT_DATETIME_VALUE,
    DEFAULT_PRIORITY_VALUE,
    DEFAULT_TYPE_VALUE,
    TASK_WITH_DEFAULT_VALUES,
} from "./schema.const";

/** Objo-related metadata for each task in a user's vault. */
export interface Task {
    /** Metadata describing the actionable status of the task. */
    status: TaskStatus;
    /** Metadata describing where the task was taken from. */
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
        /** When the task is scheduled to be worked on. */
        scheduled: DateTime;
        /** When the task is able to be started. */
        start: DateTime;
    };
    /** The time-of-day associated with this task. */
    times: {
        /** The start time scheduled for the task. The "date" part of the value is ignored. */
        start: DateTime;
        /** The end time scheduled for the task. The "date" part of the value is ignored. */
        end: DateTime;
    };
    /** The description of the task. */
    description: string;
    /** Integer between 1 and 5; lower numbers represent higher priority tasks. */
    priority: number;
    /** The tags associated with this task. The leading hash character ("#") is omitted. */
    tags: ReadonlySet<string>;
    /** Optional user-defined string for uniquely identifying this task in the vault. */
    id: string;
    /** A set of {@link Task.id}s that need to be completed before starting this task. */
    dependsOn: ReadonlySet<string>;
}

/** Metadata about the status of a task (e.g. "OPEN" or "DONE"). */
export type TaskStatus =
    | {
          /**
           * The status of the task. Mirrors the status provided by the "obsidian-tasks" plugin.
           * "UNKNOWN" is reserved for tasks that are invalid or unparsable.
           */
          type: "UNKNOWN";
      }
    | {
          /**
           * The status of the task. Mirrors the status provided by the "obsidian-tasks" plugin.
           * "UNKNOWN" is reserved for tasks that are invalid or unparsable.
           */
          type: "OPEN" | "DONE" | "CANCELLED" | "NON_TASK";
          /**
           * The character inside the \[ \] brackets.
           * Generally a space (" ") for incomplete tasks and an ("x") for completed tasks, but allows for plugins which
           * support alternative task statuses.
           */
          symbol: string;
      };

/** Metadata about where a task was taken or generated from. */
export type TaskSource =
    | {
          /**
           * Identifies where this task was parsed from.
           * "UNKNOWN" is reserved for tasks that are invalid or unparsable.
           */
          type: "UNKNOWN";
      }
    | {
          /**
           * Identifies where this task was parsed from.
           * "UNKNOWN" is reserved for tasks that are invalid or unparsable.
           */
          type: "PAGE";
          /** The full path of the file this task was taken from. */
          path: string;
          /** The name of the file this task was taken from, excluding its extension. */
          name: string;
          /** The section this task belongs to (e.g. under a heading). */
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
