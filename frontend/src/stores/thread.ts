import { writable } from "svelte/store";
import type { EventWrapper, Message, ThreadSummary } from "../domain/chat/chat";

/**
 * This just holds some dummy state for us while we don't have an api
 */

// threadId -> events
type ThreadLookup = Record<string, EventWrapper<Message>[]>;

// messageId -> ThreadSummary for fake threads
type ThreadSummaryLookup = Record<number, ThreadSummary>;

export const threadSummaryStore = writable<ThreadSummaryLookup>({
    20604599553837410939685844215614406656: {
        threadId: "thread1",
        participantIds: new Set(["sbzkb-zqaaa-aaaaa-aaaiq-cai", "sgymv-uiaaa-aaaaa-aaaia-cai"]),
        numberOfReplies: 5,
        latestEventIndex: 12345,
    },
});

const { subscribe, set, update } = writable<ThreadLookup>({});

export const threadStore = {
    subscribe,
    set,
    addToThread: (threadId: string, event: EventWrapper<Message>): void => {
        update((lookup) => {
            if (lookup[threadId] === undefined) {
                lookup[threadId] = [];
            }
            lookup[threadId].push(event);
            return lookup;
        });
    },
};
