import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { mergeTaskParts } from "../merge-task-parts";

describe("Merging task parts", () => {
    it("gives default values when called with nothing", () => {
        const task = mergeTaskParts();

        expect(task.status.type).toEqual("UNKNOWN");
        expect(task.source.type).toEqual("UNKNOWN");
        expect(task.dates.done).toBeInstanceOf(DateTime);
        expect(task.dates.cancelled).toBeInstanceOf(DateTime);
        expect(task.dates.scheduled).toBeInstanceOf(DateTime);
        expect(task.dates.start).toBeInstanceOf(DateTime);
        expect(task.dates.due).toBeInstanceOf(DateTime);
        expect(task.dates.created).toBeInstanceOf(DateTime);
        expect(task.description).toEqual("");
        expect(task.priority).toEqual(3);
        expect(task.recurrenceRule).toEqual("");
        expect(task.tags).toEqual(new Set());
        expect(task.id).toEqual("");
        expect(task.dependsOn).toEqual(new Set());
    });

    it("skips empty descriptions", () => {
        const task = mergeTaskParts({ description: "" }, { description: "desc" });

        expect(task.description).toEqual("desc");
    });

    it("keeps non-empty descriptions", () => {
        const task = mergeTaskParts({ description: "wow" }, { description: "uh-oh!" });

        expect(task.description).toEqual("wow");
    });

    it("skips invalid dates", () => {
        const valid = DateTime.now();
        const invalid = DateTime.invalid("asdf");

        const task = mergeTaskParts({ dates: { done: invalid } }, { dates: { done: valid } });

        expect(task.dates.done).toBe(valid);
    });

    it("keeps valid dates", () => {
        const now = DateTime.now();
        const later = now.plus({ minutes: 10 });

        const task = mergeTaskParts({ dates: { done: now } }, { dates: { done: later } });

        expect(task.dates.done).toBe(now);
    });

    it("skips invalid times", () => {
        const valid = DateTime.now();
        const invalid = DateTime.invalid("asdf");

        const task = mergeTaskParts({ times: { start: invalid } }, { times: { start: valid } });

        expect(task.times.start).toBe(valid);
    });

    it("keeps valid times", () => {
        const now = DateTime.now();
        const later = now.plus({ minutes: 10 });

        const task = mergeTaskParts({ times: { start: now } }, { times: { start: later } });

        expect(task.times.start).toBe(now);
    });

    it("takes union of tags", () => {
        const task = mergeTaskParts({ tags: new Set(["a", "b"]) }, { tags: new Set(["b", "c"]) });

        expect(task.tags).toEqual(new Set(["a", "b", "c"]));
    });

    it("gives default priority value when unspecified", () => {
        const task = mergeTaskParts({});

        expect(task.priority).toEqual(3);
    });

    it("skips missing priority value", () => {
        const task = mergeTaskParts({}, { priority: 1 });

        expect(task.priority).toEqual(1);
    });

    it("skips default priority value", () => {
        const task = mergeTaskParts({ priority: 3 }, { priority: 1 });

        expect(task.priority).toEqual(1);
    });

    it("keeps non-default priority", () => {
        const task = mergeTaskParts({ priority: 1 }, { priority: 4 });

        expect(task.priority).toEqual(1);
    });

    it("gives default status when unspecified", () => {
        const task = mergeTaskParts({});

        expect(task.status.type).toEqual("UNKNOWN");
    });

    it("skips missing status", () => {
        const task = mergeTaskParts({}, { status: { type: "DONE" } });

        expect(task.status.type).toEqual("DONE");
    });

    it("skips default status", () => {
        const task = mergeTaskParts({ status: { type: "UNKNOWN" } }, { status: { type: "DONE" } });

        expect(task.status.type).toEqual("DONE");
    });

    it("keeps non-default status", () => {
        const task = mergeTaskParts({ status: { type: "DONE" } }, { status: { type: "UNKNOWN" } });

        expect(task.status.type).toEqual("DONE");
    });

    it("gives default source when unspecified", () => {
        const task = mergeTaskParts({});

        expect(task.source.type).toEqual("UNKNOWN");
    });

    it("skips missing source", () => {
        const task = mergeTaskParts({}, { source: { type: "PAGE" } });

        expect(task.source.type).toEqual("PAGE");
    });

    it("skips default source", () => {
        const task = mergeTaskParts({ source: { type: "UNKNOWN" } }, { source: { type: "PAGE" } });

        expect(task.source.type).toEqual("PAGE");
    });

    it("keeps non-default source", () => {
        const task = mergeTaskParts({ source: { type: "PAGE" } }, { source: { type: "UNKNOWN" } });

        expect(task.source.type).toEqual("PAGE");
    });
});
