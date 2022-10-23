import { extractUserIdsFromMentions } from "../domain/user/user.utils";
import {
    ChatEvent,
    ChatMetrics,
    ChatSummary,
    ChatSummaryUpdates,
    Cryptocurrency,
    cryptoLookup,
    DirectChatSummary,
    DirectChatSummaryUpdates,
    EventWrapper,
    GroupChatDetails,
    GroupChatDetailsUpdates,
    GroupChatSummary,
    GroupChatSummaryUpdates,
    GroupSubtype,
    GroupSubtypeUpdate,
    IndexRange,
    Member,
    Mention,
    Message,
    MessageContent,
    ThreadRead,
    ThreadSyncDetails,
    ThreadSyncDetailsUpdates,
    UpdateArgs,
    UpdatesResponse,
} from "../domain";
import { UnsupportedValueError } from "./error";
import type { MessageFormatter } from "./i18n";
import { toRecord } from "./list";
import { applyOptionUpdate } from "./mapping";
import Identicon from "identicon.js";
import md5 from "md5";
import { EVENT_PAGE_SIZE, OPENCHAT_BOT_AVATAR_URL, OPENCHAT_BOT_USER_ID } from "../constants";

export function compareChats(a: ChatSummary, b: ChatSummary): number {
    return Number(getDisplayDate(b) - getDisplayDate(a));
}

export function mergeChatUpdates(
    chatSummaries: ChatSummary[],
    updateResponse: UpdatesResponse
): ChatSummary[] {
    return mergeThings((c) => c.chatId, mergeUpdates, chatSummaries, {
        added: updateResponse.chatsAdded,
        updated: updateResponse.chatsUpdated,
        removed: updateResponse.chatsRemoved,
    }).sort(compareChats);
}

// this is used to merge both the overall list of chats with updates and also the list of participants
// within a group chat
function mergeThings<A, U>(
    keyFn: (a: A | U) => string,
    mergeFn: (existing: A | undefined, updated: U) => A | undefined,
    things: A[],
    updates: { added: A[]; updated: U[]; removed: Set<string> }
): A[] {
    const remaining = things.filter((t) => !updates.removed.has(keyFn(t)));
    const dict = toLookup(keyFn, remaining);
    const updated = updates.updated.reduce((dict, updated) => {
        const key = keyFn(updated);
        const merged = mergeFn(dict[key], updated);
        if (merged) {
            dict[key] = merged;
        }
        return dict;
    }, dict);

    // concat the updated and the added and then merge the result so we are sure
    // there are no duplicates (according to the provided keyFn)
    return Object.values(
        [...Object.values(updated), ...updates.added].reduce((merged, thing) => {
            merged[keyFn(thing)] = thing;
            return merged;
        }, {} as Record<string, A>)
    );
}

export function mergeUpdates(
    chat: ChatSummary | undefined,
    updatedChat: ChatSummaryUpdates
): ChatSummary | undefined {
    if (!chat) return undefined;

    if (chat.chatId !== updatedChat.chatId) {
        throw new Error("Cannot update chat from a chat with a different chat id");
    }

    if (chat.kind === "group_chat" && updatedChat.kind === "group_chat") {
        return mergeUpdatedGroupChat(chat, updatedChat);
    }

    if (chat.kind === "direct_chat" && updatedChat.kind === "direct_chat") {
        return mergeUpdatedDirectChat(chat, updatedChat);
    }

    throw new Error("Cannot update chat with a chat of a different kind");
}

function mergeUpdatedDirectChat(
    chat: DirectChatSummary,
    updatedChat: DirectChatSummaryUpdates
): DirectChatSummary {
    return {
        ...chat,
        readByMeUpTo: updatedChat.readByMeUpTo ?? chat.readByMeUpTo,
        readByThemUpTo: updatedChat.readByThemUpTo ?? chat.readByThemUpTo,
        latestEventIndex: getLatestEventIndex(chat, updatedChat),
        latestMessage: getLatestMessage(chat, updatedChat),
        notificationsMuted: updatedChat.notificationsMuted ?? chat.notificationsMuted,
        metrics: updatedChat.metrics ?? chat.metrics,
        myMetrics: updatedChat.myMetrics ?? chat.myMetrics,
        archived: updatedChat.archived ?? chat.archived,
    };
}

function mergeUpdatedGroupChat(
    chat: GroupChatSummary,
    updatedChat: GroupChatSummaryUpdates
): GroupChatSummary {
    return {
        ...chat,
        name: updatedChat.name ?? chat.name,
        description: updatedChat.description ?? chat.description,
        readByMeUpTo: updatedChat.readByMeUpTo ?? chat.readByMeUpTo,
        lastUpdated: updatedChat.lastUpdated,
        latestEventIndex: getLatestEventIndex(chat, updatedChat),
        latestMessage: getLatestMessage(chat, updatedChat),
        blobReference: applyOptionUpdate(chat.blobReference, updatedChat.avatarBlobReferenceUpdate),
        notificationsMuted: updatedChat.notificationsMuted ?? chat.notificationsMuted,
        memberCount: updatedChat.memberCount ?? chat.memberCount,
        myRole: updatedChat.myRole ?? (chat.myRole === "previewer" ? "participant" : chat.myRole),
        mentions: mergeMentions(chat.mentions, updatedChat.mentions),
        ownerId: updatedChat.ownerId ?? chat.ownerId,
        permissions: updatedChat.permissions ?? chat.permissions,
        metrics: updatedChat.metrics ?? chat.metrics,
        myMetrics: updatedChat.myMetrics ?? chat.myMetrics,
        public: updatedChat.public ?? chat.public,
        latestThreads: mergeThreadSyncDetails(updatedChat.latestThreads, chat.latestThreads),
        subtype: mergeSubtype(updatedChat.subtype, chat.subtype),
        archived: updatedChat.archived ?? chat.archived,
    };
}

function mergeThreadSyncDetails(
    updated: ThreadSyncDetailsUpdates[] | undefined,
    existing: ThreadSyncDetails[]
) {
    if (updated === undefined) return existing;

    return Object.values(
        updated.reduce(
            (merged, thread) => {
                const existing = merged[thread.threadRootMessageIndex];
                if (existing !== undefined || thread.latestEventIndex !== undefined) {
                    merged[thread.threadRootMessageIndex] = {
                        threadRootMessageIndex: thread.threadRootMessageIndex,
                        lastUpdated: thread.lastUpdated,
                        readUpTo: thread.readUpTo ?? existing?.readUpTo,
                        latestEventIndex: thread.latestEventIndex ?? existing.latestEventIndex,
                        latestMessageIndex:
                            thread.latestMessageIndex ?? existing.latestMessageIndex,
                    };
                }
                return merged;
            },
            toRecord(existing, (t) => t.threadRootMessageIndex)
        )
    );
}

function mergeSubtype(updated: GroupSubtypeUpdate, existing: GroupSubtype): GroupSubtype {
    if (updated.kind === "no_change") {
        return existing;
    } else if (updated.kind === "set_to_none") {
        return undefined;
    } else {
        return updated.subtype;
    }
}

function mergeMentions(existing: Mention[], incoming: Mention[]): Mention[] {
    return [
        ...existing,
        ...incoming.filter(
            (m1) => existing.find((m2) => m1.messageId === m2.messageId) === undefined
        ),
    ];
}

function getLatestEventIndex(chat: ChatSummary, updatedChat: ChatSummaryUpdates): number {
    return Math.max(updatedChat.latestEventIndex ?? 0, chat.latestEventIndex);
}

function getLatestMessage(
    chat: ChatSummary,
    updatedChat: ChatSummaryUpdates
): EventWrapper<Message> | undefined {
    if (chat.latestMessage === undefined) return updatedChat.latestMessage;
    if (updatedChat.latestMessage === undefined) return chat.latestMessage;

    // If the local message is unconfirmed, treat that as the latest
    // FIXME - we can get round this by adding an unconfirmed flag to the client side message representation
    // const isLocalLatestUnconfirmed = unconfirmed.contains(
    //     chat.chatId,
    //     chat.latestMessage.event.messageId
    // );
    // if (isLocalLatestUnconfirmed) return chat.latestMessage;

    // Otherwise take the one with the highest event index, if they match, take the server version since it may have had
    // subsequent updates (eg. deleted)
    return updatedChat.latestMessage.index >= chat.latestMessage.index
        ? updatedChat.latestMessage
        : chat.latestMessage;
}

function toLookup<T>(keyFn: (t: T) => string, things: T[]): Record<string, T> {
    return things.reduce<Record<string, T>>((agg, thing) => {
        agg[keyFn(thing)] = thing;
        return agg;
    }, {});
}

export function getDisplayDate(chat: ChatSummary): bigint {
    const started = chat.kind === "direct_chat" ? chat.dateCreated : chat.joined;

    return chat.latestMessage && chat.latestMessage.timestamp > started
        ? chat.latestMessage.timestamp
        : started;
}

export function mergeGroupChatDetails(
    previous: GroupChatDetails,
    updates: GroupChatDetailsUpdates
): GroupChatDetails {
    return {
        latestEventIndex: updates.latestEventIndex,
        members: mergeThings((p) => p.userId, mergeParticipants, previous.members, {
            added: [],
            updated: updates.membersAddedOrUpdated,
            removed: updates.membersRemoved,
        }),
        blockedUsers: new Set<string>(
            mergeThings(identity, identity, [...previous.blockedUsers], {
                added: [...updates.blockedUsersAdded],
                updated: [],
                removed: updates.blockedUsersRemoved,
            })
        ),
        pinnedMessages: mergePinnedMessages(
            previous.pinnedMessages,
            updates.pinnedMessagesAdded,
            updates.pinnedMessagesRemoved
        ),
        rules: updates.rules ?? previous.rules,
    };
}

function mergePinnedMessages(
    current: Set<number>,
    added: Set<number>,
    removed: Set<number>
): Set<number> {
    removed.forEach((m) => current.delete(m));
    added.forEach((m) => current.add(m));
    return current;
}

function mergeParticipants(_: Member | undefined, updated: Member) {
    return updated;
}

export function identity<T>(x: T): T {
    return x;
}

export function getFirstUnreadMessageIndex(chat: ChatSummary): number | undefined {
    if (chat.kind === "group_chat" && chat.myRole === "previewer") return undefined;

    return chat.readByMeUpTo;

    // FIXME - we cannot access messageRead from the agent project
    // return messagesRead.getFirstUnreadMessageIndex(
    //     chat.chatId,
    //     chat.latestMessage?.event.messageIndex
    // );
}

export function indexRangeForChat(chat: ChatSummary): IndexRange {
    return [getMinVisibleEventIndex(chat), chat.latestEventIndex];
}

export function getMinVisibleEventIndex(chat: ChatSummary): number {
    if (chat.kind === "direct_chat") return 0;
    return chat.minVisibleEventIndex;
}

export function threadsReadFromChat(chat: ChatSummary): ThreadRead[] {
    return chat.kind === "group_chat"
        ? chat.latestThreads
              .filter((t) => t.readUpTo !== undefined)
              .map((t) => ({
                  threadRootMessageIndex: t.threadRootMessageIndex,
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  readUpTo: t.readUpTo!,
              }))
        : [];
}

export function updateArgsFromChats(timestamp: bigint, chatSummaries: ChatSummary[]): UpdateArgs {
    return {
        updatesSince: {
            timestamp,
            groupChats: chatSummaries
                .filter((c) => c.kind === "group_chat" && c.myRole !== "previewer")
                .map((g) => ({
                    chatId: g.chatId,
                    lastUpdated: (g as GroupChatSummary).lastUpdated,
                })),
        },
    };
}

export function userIdsFromEvents(events: EventWrapper<ChatEvent>[]): Set<string> {
    const fakeFormatter = (k: string) => k;
    return events.reduce<Set<string>>((userIds, e) => {
        if ("userIds" in e.event) {
            e.event.userIds.forEach((u) => userIds.add(u));
        }
        switch (e.event.kind) {
            case "message":
                userIds.add(e.event.sender);
                if (
                    e.event.repliesTo !== undefined &&
                    e.event.repliesTo.kind === "rehydrated_reply_context"
                ) {
                    userIds.add(e.event.repliesTo.senderId);
                    extractUserIdsFromMentions(
                        getContentAsText(fakeFormatter, e.event.repliesTo.content)
                    ).forEach((id) => userIds.add(id));
                }
                extractUserIdsFromMentions(
                    getContentAsText(fakeFormatter, e.event.content)
                ).forEach((id) => userIds.add(id));
                break;
            case "member_joined":
            case "member_left":
            case "member_assumes_super_admin":
            case "member_relinquishes_super_admin":
            case "member_dismissed_as_super_admin":
                userIds.add(e.event.userId);
                break;
            case "name_changed":
            case "desc_changed":
            case "rules_changed":
            case "avatar_changed":
            case "role_changed":
            case "permissions_changed":
            case "group_visibility_changed":
            case "group_invite_code_changed":
                userIds.add(e.event.changedBy);
                break;
            case "group_chat_created":
                userIds.add(e.event.created_by);
                break;
            case "members_added":
                userIds.add(e.event.addedBy);
                break;
            case "members_removed":
                userIds.add(e.event.removedBy);
                break;
            case "users_blocked":
                userIds.add(e.event.blockedBy);
                break;
            case "users_unblocked":
                userIds.add(e.event.unblockedBy);
                break;
            case "ownership_transferred":
                userIds.add(e.event.oldOwner);
                break;
            case "message_pinned":
                userIds.add(e.event.pinnedBy);
                break;
            case "message_unpinned":
                userIds.add(e.event.unpinnedBy);
                break;
            case "message_deleted":
            case "message_edited":
            case "reaction_added":
            case "reaction_removed":
            case "poll_vote_registered":
            case "poll_vote_deleted":
                userIds.add(e.event.message.updatedBy);
                break;
            case "direct_chat_created":
            case "poll_ended":
            case "thread_updated":
            case "proposals_updated":
            case "aggregate_members_joined_left":
                break;
            default:
                throw new UnsupportedValueError("Unexpected ChatEvent type received", e.event);
        }
        return userIds;
    }, new Set<string>());
}

export function getContentAsText(formatter: MessageFormatter, content: MessageContent): string {
    let text;
    if (content.kind === "text_content") {
        text = content.text;
    } else if (content.kind === "image_content") {
        text = captionedContent("image", content.caption);
    } else if (content.kind === "video_content") {
        text = captionedContent("video", content.caption);
    } else if (content.kind === "audio_content") {
        text = captionedContent("audio", content.caption);
    } else if (content.kind === "file_content") {
        text = captionedContent(content.name, content.caption);
    } else if (content.kind === "crypto_content") {
        text = captionedContent(
            formatter("tokenTransfer.transfer", {
                values: { token: toSymbol(content.transfer.token) },
            }),
            content.caption
        );
    } else if (content.kind === "deleted_content") {
        text = "deleted message";
    } else if (content.kind === "placeholder_content") {
        text = "placeholder content";
    } else if (content.kind === "poll_content") {
        text = content.config.text ?? "poll";
    } else if (content.kind === "proposal_content") {
        text = content.proposal.title;
    } else if (content.kind === "giphy_content") {
        text = captionedContent(formatter("giphyMessage"), content.caption);
    } else {
        throw new UnsupportedValueError("Unrecognised content type", content);
    }
    return text.trim();
}

function toSymbol(token: Cryptocurrency): string {
    return cryptoLookup[token].symbol;
}

function captionedContent(type: string, caption?: string): string {
    if (caption) {
        return type + " - " + caption;
    } else {
        return type;
    }
}

export function buildBlobUrl(
    pattern: string,
    canisterId: string,
    blobId: bigint,
    blobType: "blobs" | "avatar"
): string {
    return `${pattern
        .replace("{canisterId}", canisterId)
        .replace("{blobType}", blobType)}${blobId}`;
}

export function buildUserAvatarUrl(pattern: string, userId: string, avatarId?: bigint): string {
    return avatarId !== undefined
        ? buildBlobUrl(pattern, userId, avatarId, "avatar")
        : userId === OPENCHAT_BOT_USER_ID
        ? OPENCHAT_BOT_AVATAR_URL
        : buildIdenticonUrl(userId);
}

function buildIdenticonUrl(userId: string): string {
    const identicon = new Identicon(md5(userId), {
        margin: 0,
        format: "svg",
    });
    return `data:image/svg+xml;base64,${identicon}`;
}

export function emptyChatMetrics(): ChatMetrics {
    return {
        audioMessages: 0,
        cyclesMessages: 0,
        edits: 0,
        icpMessages: 0,
        giphyMessages: 0,
        deletedMessages: 0,
        fileMessages: 0,
        pollVotes: 0,
        textMessages: 0,
        imageMessages: 0,
        replies: 0,
        videoMessages: 0,
        polls: 0,
        reactions: 0,
    };
}

export function enoughVisibleMessages(
    ascending: boolean,
    [minIndex, maxIndex]: IndexRange,
    events: EventWrapper<ChatEvent>[]
): boolean {
    const filtered = events.filter(eventIsVisible);
    if (filtered.length >= EVENT_PAGE_SIZE) {
        return true;
    } else if (ascending) {
        // if there are no more events then we have enough by definition
        return events[events.length - 1]?.index >= maxIndex;
    } else {
        // if there are no previous events then we have enough by definition
        return events[0].index <= minIndex;
    }
}

export function eventIsVisible(ew: EventWrapper<ChatEvent>): boolean {
    return (
        ew.event.kind !== "reaction_added" &&
        ew.event.kind !== "message_deleted" &&
        ew.event.kind !== "message_edited" &&
        ew.event.kind !== "reaction_removed" &&
        ew.event.kind !== "message_pinned" &&
        ew.event.kind !== "message_unpinned" &&
        ew.event.kind !== "poll_vote_registered" &&
        ew.event.kind !== "poll_vote_deleted" &&
        ew.event.kind !== "poll_ended" &&
        ew.event.kind !== "thread_updated" &&
        ew.event.kind !== "proposals_updated"
    );
}

export function nextIndex(
    ascending: boolean,
    events: EventWrapper<ChatEvent>[]
): number | undefined {
    if (events.length === 0) return undefined;
    return ascending ? events[events.length - 1].index + 1 : events[0].index - 1;
}
