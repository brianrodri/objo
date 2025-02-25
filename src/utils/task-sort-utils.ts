import { Task } from "@/data/tasks/task-model";

export function byStartTime(task: Task) {
    const start = task.times.start;
    return start.isValid ? start.toMillis() : Number.MAX_VALUE;
}
