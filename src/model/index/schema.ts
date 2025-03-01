import { Interval } from "luxon";
import { DeepReadonly } from "utility-types";

import { Collection } from "../collection/schema";

/** Provides an API for efficiently accessing {@link Collection}s in a vault. */
export interface VaultIndex {
    /**
     * Register a new {@link Collection} into the index.
     *
     * All calls to this function will be treated as adding a brand new collection, regardless
     * of whether the input has already been registered in an earlier call.
     *
     * @param collection - the collection to register with this index.
     * @throws if the index cannot support the given collection.
     * @returns a {@link VaultCollectionIndex} that can be used to interact with the primary index.
     */
    addCollection<C extends Collection>(collection: C): VaultCollectionIndex<C>;

    /** @returns the list of collections registered with this index. */
    getCollections(): Collection[];

    /** @returns a list of collections that claim to include the given file path. */
    getCollectionsWithFile(filePath: string): Collection[];
}

/** Provides an API for efficiently querying a {@link Collection} for its notes. */
export interface VaultCollectionIndex<C extends Collection> {
    /** The collection that has been indexed. */
    readonly collection: DeepReadonly<C>;

    /** @returns all paths in the vault corresponding to this indexed collection. */
    getNotes(): string[];

    /** @returns all paths in the vault corresponding to the given interval, if applicable. */
    getNotesFromInterval(interval: Interval): string[];
}
