import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";

import { mergeTaskParts } from "../merge";

describe(`${mergeTaskParts.name}`, () => {
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
        const valid = DateTime.fromISO("2025-01-01");
        const invalid = DateTime.invalid("unspecified date");

        const task = mergeTaskParts({ dates: { done: invalid } }, { dates: { done: valid } });

        expect(task.dates.done).toEqual(valid);
    });

    it("keeps valid dates", () => {
        const validDate = DateTime.fromISO("2025-01-01");
        const anotherValidDate = DateTime.fromISO("2025-01-02");

        const task = mergeTaskParts({ dates: { done: validDate } }, { dates: { done: anotherValidDate } });

        expect(task.dates.done).toEqual(validDate);
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
