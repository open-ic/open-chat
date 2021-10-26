import type { BlobReference, DataContent } from "../data/data";
import type { PartialUserSummary, UserSummary } from "../user/user";

export type MessageContent =
    | FileContent
    | TextContent
    | ImageContent
    | VideoContent
    | AudioContent
    | DeletedContent
    | PlaceholderContent
    | CryptocurrencyContent;

export type IndexRange = [number, number];

export interface PlaceholderContent {
    kind: "placeholder_content";
}

export type PendingCyclesTransfer = {
    transferKind: "cycles_transfer";
    kind: "pending_cycles_transfer";
    recipient: string;
    cycles: bigint;
};

export type CompletedCyclesTransfer = {
    transferKind: "cycles_transfer";
    kind: "completed_cycles_transfer";
    recipient: string;
    sender: string;
    cycles: bigint;
};

export type FailedCyclesTransfer = {
    transferKind: "cycles_transfer";
    kind: "failed_cycles_transfer";
    recipient: string;
    cycles: bigint;
    errorMessage: string;
};

export type PendingICPTransfer = {
    transferKind: "icp_transfer";
    kind: "pending_icp_transfer";
    recipient: string;
    amountE8s: bigint;
    feeE8s?: bigint;
    memo?: bigint;
};

export type CompletedICPTransfer = {
    transferKind: "icp_transfer";
    kind: "completed_icp_transfer";
    recipient: string;
    sender: string;
    amountE8s: bigint;
    feeE8s: bigint;
    memo: bigint;
    blockHeight: bigint;
};

export type FailedICPTransfer = {
    transferKind: "icp_transfer";
    kind: "failed_icp_transfer";
    recipient: string;
    amountE8s: bigint;
    feeE8s: bigint;
    memo: bigint;
    errorMessage: string;
};

export type CyclesTransfer = PendingCyclesTransfer | CompletedCyclesTransfer | FailedCyclesTransfer;

export type ICPTransfer = PendingICPTransfer | CompletedICPTransfer | FailedICPTransfer;

export type CryptocurrencyTransfer = CyclesTransfer | ICPTransfer;

export interface CryptocurrencyContent {
    kind: "crypto_content";
    caption?: string;
    transfer: CryptocurrencyTransfer;
}

export interface ImageContent extends DataContent {
    kind: "image_content";
    height: number;
    width: number;
    thumbnailData: string;
    caption?: string;
    mimeType: string;
}

export interface VideoContent {
    kind: "video_content";
    height: number;
    width: number;
    thumbnailData: string;
    caption?: string;
    mimeType: string;
    imageData: DataContent;
    videoData: DataContent;
}

export interface AudioContent extends DataContent {
    kind: "audio_content";
    caption?: string;
    mimeType: string;
}

export type DeletedContent = {
    kind: "deleted_content";
    deletedBy: string;
    timestamp: bigint;
};

export interface TextContent {
    kind: "text_content";
    text: string;
}

export interface FileContent extends DataContent {
    kind: "file_content";
    name: string;
    caption?: string;
    mimeType: string;
    fileSize: number;
}

export type ReplyContext = RawReplyContext | RehydratedReplyContext;

export type RawReplyContext = {
    kind: "raw_reply_context";
    eventIndex: number;
    chatIdIfOther?: string;
};

export type RehydratedReplyContext = {
    kind: "rehydrated_reply_context";
    content: MessageContent;
    senderId: string;
    messageId: bigint;
    messageIndex: number;
    eventIndex: number;
    chatId: string;
};

export type EnhancedReplyContext = RehydratedReplyContext & {
    sender?: PartialUserSummary;
    content: MessageContent;
};

export type Message = {
    kind: "message";
    messageId: bigint;
    messageIndex: number;
    sender: string;
    content: MessageContent;
    repliesTo?: ReplyContext;
    reactions: Reaction[];
    edited: boolean;
};

export type LocalReaction = {
    reaction: string;
    timestamp: number;
    kind: "add" | "remove";
    userId: string; // this can actually be a remote user via rtc
};

export type Reaction = {
    reaction: string;
    userIds: Set<string>;
};

export type EventsResponse<T extends ChatEvent> = "events_failed" | EventsSuccessResult<T>;

export type DirectChatEvent =
    | Message
    | MessageDeleted
    | MessageEdited
    | ReactionAdded
    | ReactionRemoved
    | DirectChatCreated;

export type GroupChatEvent =
    | Message
    | GroupChatCreated
    | ParticipantsAdded
    | ParticipantJoined
    | ParticipantsPromotedToAdmin
    | ParticipantsRemoved
    | ParticipantLeft
    | GroupNameChanged
    | AvatarChanged
    | MessageDeleted
    | MessageEdited
    | ReactionAdded
    | ReactionRemoved
    | GroupDescChanged
    | UsersBlocked
    | UsersUnblocked
    | ParticipantsDismissedAsAdmin;

export type ChatEvent = GroupChatEvent | DirectChatEvent;

export type DirectChatCreated = {
    kind: "direct_chat_created";
};

export type ParticipantsAdded = {
    kind: "participants_added";
    userIds: string[];
    addedBy: string;
};

export type ParticipantJoined = {
    kind: "participant_joined";
    userId: string;
};

export type ParticipantLeft = {
    kind: "participant_left";
    userId: string;
};

export type GroupNameChanged = {
    kind: "name_changed";
    changedBy: string;
};

export type GroupDescChanged = {
    kind: "desc_changed";
    changedBy: string;
};

export type AvatarChanged = {
    kind: "avatar_changed";
    changedBy: string;
};

export type MessageDeleted = {
    kind: "message_deleted";
    message: StaleMessage;
};

export type MessageEdited = {
    kind: "message_edited";
    message: StaleMessage;
};

export type ReactionAdded = {
    kind: "reaction_added";
    message: StaleMessage;
};

export type ReactionRemoved = {
    kind: "reaction_removed";
    message: StaleMessage;
};

export type StaleMessage = {
    eventIndex: number;
    messageId: bigint;
};

export type UsersBlocked = {
    kind: "users_blocked";
    userIds: string[];
    blockedBy: string;
};

export type UsersUnblocked = {
    kind: "users_unblocked";
    userIds: string[];
    unblockedBy: string;
};

export type ParticipantsRemoved = {
    kind: "participants_removed";
    userIds: string[];
    removedBy: string;
};

export type ParticipantsDismissedAsAdmin = {
    kind: "participants_dismissed_as_admin";
    userIds: string[];
    dismissedBy: string;
};

export type ParticipantsPromotedToAdmin = {
    kind: "participants_promoted_to_admin";
    userIds: string[];
    promotedBy: string;
};

export type GroupChatCreated = {
    kind: "group_chat_created";
    name: string;
    description: string;
    created_by: string;
};

export type EventWrapper<T extends ChatEvent> = {
    event: T;
    timestamp: bigint;
    index: number;
};

export type EventsSuccessResult<T extends ChatEvent> = {
    events: EventWrapper<T>[];
    affectedEvents: EventWrapper<T>[];
};

export type GroupChatUpdatesSince = {
    updatesSince: bigint;
    chatId: string;
};

export type UpdatesSince = {
    groupChats: { lastUpdated: bigint; chatId: string }[];
    timestamp: bigint;
};

export type UpdateArgs = {
    updatesSince: UpdatesSince;
};

export type MergedUpdatesResponse = {
    chatSummaries: ChatSummary[];
    blockedUsers: Set<string>;
    timestamp: bigint;
};

export type UpdatesResponse = {
    blockedUsers: Set<string>;
    chatsUpdated: ChatSummaryUpdates[];
    chatsAdded: ChatSummary[];
    chatsRemoved: Set<string>;
    timestamp: bigint;
    cyclesBalance?: bigint;
};

export type InitialStateResponse = {
    blockedUsers: Set<string>;
    chats: ChatSummary[];
    timestamp: bigint;
    cyclesBalance: bigint;
};

export type ChatSummaryUpdates = DirectChatSummaryUpdates | GroupChatSummaryUpdates;

type ChatSummaryUpdatesCommon = {
    chatId: string;
    readByMe?: MessageIndexRange[];
    latestEventIndex?: number;
    notificationsMuted?: boolean;
};

export type DirectChatSummaryUpdates = ChatSummaryUpdatesCommon & {
    kind: "direct_chat";
    latestMessage?: EventWrapper<Message>;
    readByThem?: MessageIndexRange[];
};

export type GroupChatSummaryUpdates = ChatSummaryUpdatesCommon & {
    kind: "group_chat";
    lastUpdated: bigint;
    name?: string;
    description?: string;
    latestMessage?: EventWrapper<Message>;
    avatarBlobReference?: BlobReference;
};

export type ParticipantRole = "admin" | "standard";

export type Participant = {
    role: ParticipantRole;
    userId: string;
};

export type FullParticipant = Participant & PartialUserSummary & { kind: "full_participant" };
export type BlockedParticipant = Participant & PartialUserSummary & { kind: "blocked_participant" };

export type GroupChatDetailsResponse = "caller_not_in_group" | GroupChatDetails;

export type GroupChatDetailsUpdatesResponse =
    | "success_no_updates"
    | "caller_not_in_group"
    | GroupChatDetailsUpdates;

export type GroupChatDetails = {
    participants: Participant[];
    blockedUsers: Set<string>;
    latestEventIndex: number;
};

export type GroupChatDetailsUpdates = {
    participantsAddedOrUpdated: Participant[];
    participantsRemoved: Set<string>;
    blockedUsersAdded: Set<string>;
    blockedUsersRemoved: Set<string>;
    latestEventIndex: number;
};

export type ChatSummary = DirectChatSummary | GroupChatSummary;

export type MessageIndexRange = {
    from: number;
    to: number;
};

type ChatSummaryCommon = {
    chatId: string; // this represents a Principal
    readByMe: MessageIndexRange[];
    latestEventIndex: number;
    notificationsMuted: boolean;
};

export type DirectChatSummary = ChatSummaryCommon & {
    kind: "direct_chat";
    them: string;
    readByThem: MessageIndexRange[];
    dateCreated: bigint;
    latestMessage?: EventWrapper<Message>;
};

export type GroupChatSummary = DataContent &
    ChatSummaryCommon & {
        kind: "group_chat";
        name: string;
        description: string;
        public: boolean;
        joined: bigint;
        minVisibleEventIndex: number;
        minVisibleMessageIndex: number;
        lastUpdated: bigint;
        latestMessage?: EventWrapper<Message>;
    };

export type CandidateParticipant = {
    role: ParticipantRole;
    user: UserSummary;
};

export type CandidateGroupChat = {
    name: string;
    description: string;
    historyVisible: boolean;
    isPublic: boolean;
    participants: CandidateParticipant[];
    avatar?: DataContent;
};

// todo - there are all sorts of error conditions here that we need to deal with but - later
export type CreateGroupResponse =
    | CreateGroupSuccess
    | CreateGroupInternalError
    | CreateGroupInvalidName
    | CreateGroupNameTooLong
    | CreateGroupDescriptionTooLong
    | GroupNameTaken
    | AvatarTooBig
    | MaxGroupsCreated
    | CreateGroupThrottled;

export type CreateGroupSuccess = {
    kind: "success";
    canisterId: string;
};

export type CreateGroupInternalError = {
    kind: "internal_error";
};

export type CreateGroupInvalidName = {
    kind: "invalid_name";
};

export type CreateGroupNameTooLong = {
    kind: "name_too_long";
};

export type CreateGroupDescriptionTooLong = {
    kind: "description_too_long";
};

export type GroupNameTaken = {
    kind: "group_name_taken";
};

export type AvatarTooBig = {
    kind: "avatar_too_big";
};

export type MaxGroupsCreated = {
    kind: "max_groups_created";
};

export type CreateGroupThrottled = {
    kind: "throttled";
};

export type AddParticipantsResponse =
    | AddParticipantsSuccess
    | AddParticipantsNotAuthorised
    | ParticipantLimitReached
    | AddParticipantsPartialSuccess
    | AddParticipantsFailed
    | AddParticipantsNotInGroup;

export type AddParticipantsSuccess = {
    kind: "add_participants_success";
};

export type AddParticipantsNotInGroup = {
    kind: "add_participants_not_in_group";
};

export type AddParticipantsNotAuthorised = {
    kind: "add_participants_not_authorised";
};

export type ParticipantLimitReached = {
    kind: "participant_limit_reached";
};

export type AddParticipantsPartialSuccess = {
    kind: "add_participants_partial_success";
    usersAdded: string[];
    usersAlreadyInGroup: string[];
    usersBlockedFromGroup: string[];
    usersWhoBlockedRequest: string[];
    errors: string[];
};

export type AddParticipantsFailed = {
    kind: "add_participants_failed";
    usersAlreadyInGroup: string[];
    usersBlockedFromGroup: string[];
    usersWhoBlockedRequest: string[];
    errors: string[];
};

export type EditMessageResponse =
    | "success"
    | "chat_not_found"
    | "message_not_found"
    | "not_in_group";

export type SendMessageResponse =
    | SendMessageSuccess
    | SendMessageRecipientBlocked
    | SendMessageInvalidRequest
    | SendMessageTooLong
    | SendMessageBalanceExceeded
    | SendMessageRecipientNotFound
    | TransationFailed
    | SendMessageNotInGroup;

export type SendMessageSuccess = {
    kind: "success";
    timestamp: bigint;
    messageIndex: number;
    eventIndex: number;
};

export type TransationFailed = {
    kind: "transaction_failed";
};

export type SendMessageRecipientBlocked = {
    kind: "recipient_blocked";
};

export type SendMessageInvalidRequest = {
    kind: "invalid_request";
};

export type SendMessageTooLong = {
    kind: "message_too_long";
};

export type SendMessageRecipientNotFound = {
    kind: "recipient_not_found";
};

export type SendMessageBalanceExceeded = {
    kind: "balance_exceeded";
};

export type SendMessageNotInGroup = {
    kind: "not_in_group";
};

export type PutChunkResponse =
    | "put_chunk_success"
    | "put_chunk_full"
    | "put_chunk_too_big"
    | "chunk_already_exists"
    | "caller_not_in_group"
    | "blob_too_big"
    | "blob_already_exists";

export type SetAvatarResponse = "avatar_too_big" | "success" | "internal_error";

export type MakeAdminResponse =
    | "user_not_in_group"
    | "caller_not_in_group"
    | "not_authorised"
    | "success";

export type RemoveAdminResponse =
    | "user_not_in_group"
    | "caller_not_in_group"
    | "not_authorised"
    | "cannot_remove_self"
    | "success";

export type RemoveParticipantResponse =
    | "user_not_in_group"
    | "caller_not_in_group"
    | "not_authorised"
    | "success"
    | "cannot_remove_self"
    | "internal_error";

export type BlockUserResponse =
    | "success"
    | "group_not_public"
    | "user_not_in_group"
    | "caller_not_in_group"
    | "not_authorised"
    | "internal_error"
    | "cannot_block_self";

export type UnblockUserResponse =
    | "success"
    | "group_not_public"
    | "cannot_unblock_self"
    | "caller_not_in_group"
    | "not_authorised";

export type LeaveGroupResponse =
    | "success"
    | "group_not_found"
    | "internal_error"
    | "not_in_group"
    | "last_admin";

export type JoinGroupResponse =
    | "success"
    | "blocked"
    | "group_not_found"
    | "group_not_public"
    | "already_in_group"
    | "participant_limit_reached"
    | "internal_error";

export type MarkReadRequest = {
    ranges: MessageIndexRange[];
    chatId: string;
}[];

export type MarkReadResponse = "success";

export type UpdateGroupResponse =
    | "success"
    | "not_authorised"
    | "name_too_long"
    | "desc_too_long"
    | "unchanged"
    | "name_taken"
    | "not_in_group"
    | "internal_error";

export type ToggleReactionResponse =
    | "added"
    | "removed"
    | "invalid"
    | "message_not_found"
    | "not_in_group"
    | "chat_not_found";

export type DeleteMessageResponse = "not_in_group" | "chat_not_found" | "success";
