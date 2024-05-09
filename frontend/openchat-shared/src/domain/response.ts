import type { GateCheckFailed, PinIncorrect, PinRequired, TooManyFailedPinAttempts } from "./chat";

export type UserNotInChat = { kind: "user_not_in_chat" };
export type ChatNotFound = { kind: "chat_not_found" };
export type UserLimitReached = { kind: "user_limit_reached" };
export type Success = { kind: "success" };
export type SuccessNoUpdates = { kind: "success_no_updates" };
export type UserNotInCommunity = { kind: "user_not_in_community" };
export type CommunityFrozen = { kind: "community_frozen" };
export type ChatFrozen = { kind: "chat_frozen" };
export type CommunityNotPublic = { kind: "community_not_public" };
export type MessageNotFound = {
    kind: "message_not_found";
};
export type Offline = {
    kind: "offline";
};
export type Failure = {
    kind: "failure";
};
export type NotAuthorised = {
    kind: "not_authorized";
};
export type UserSuspended = { kind: "user_suspended" };
export type NoChange = {
    kind: "no_change";
};
export type InternalError = {
    kind: "internal_error";
    error?: string;
};
export type Invalid = {
    kind: "invalid";
};
export type TargetUserNotInCommunity = {
    kind: "target_user_not_in_community";
};
export type UserBlocked = {
    kind: "user_blocked";
};
export type NotPlatformModerator = {
    kind: "not_platform_moderator";
};
export type Retrying = {
    kind: "retrying";
    error: string;
};
export type TransferFailed = {
    kind: "transfer_failed";
    error?: string;
};
export const CommonResponses = {
    userNotInChat: (): UserNotInChat => ({ kind: "user_not_in_chat" }) as UserNotInChat,
    chatNotFound: (): ChatNotFound => ({ kind: "chat_not_found" }) as ChatNotFound,
    userLimitReached: (): UserLimitReached => ({ kind: "user_limit_reached" }) as UserLimitReached,
    notAuthorized: (): NotAuthorised => ({ kind: "not_authorized" }) as NotAuthorised,
    success: (): Success => ({ kind: "success" }) as Success,
    successNoUpdates: (): SuccessNoUpdates => ({ kind: "success_no_updates" }) as SuccessNoUpdates,
    userNotInCommunity: (): UserNotInCommunity =>
        ({ kind: "user_not_in_community" }) as UserNotInCommunity,
    userSuspended: (): UserSuspended => ({ kind: "user_suspended" }) as UserSuspended,
    communityFrozen: (): CommunityFrozen => ({ kind: "community_frozen" }) as CommunityFrozen,
    messageNotFound: (): MessageNotFound => ({ kind: "message_not_found" }) as MessageNotFound,
    noChange: (): NoChange => ({ kind: "no_change" }) as NoChange,
    communityNotPublic: (): CommunityNotPublic =>
        ({ kind: "community_not_public" }) as CommunityNotPublic,
    internalError: (): InternalError => ({ kind: "internal_error" }) as InternalError,
    invalid: (): Invalid => ({ kind: "invalid" }) as Invalid,
    targetUserNotInCommunity: (): TargetUserNotInCommunity =>
        ({ kind: "target_user_not_in_community" }) as TargetUserNotInCommunity,
    notPlatformModerator: (): NotPlatformModerator =>
        ({ kind: "not_platform_moderator" }) as NotPlatformModerator,
    userBlocked: (): UserBlocked => ({ kind: "user_blocked" }) as UserBlocked,
    failure: (): Failure => ({ kind: "failure" }) as Failure,
    offline: (): Offline => ({ kind: "offline" }) as Offline,
    blocked: (): Blocked => ({ kind: "blocked" }) as Blocked,
};

export type Blocked = {
    kind: "blocked";
};

export type ApproveAccessGatePaymentResponse = Success | PinRequired | PinIncorrect | TooManyFailedPinAttempts | Failure;

export type ClientJoinGroupResponse = Success | Blocked | GateCheckFailed | PinRequired | PinIncorrect | TooManyFailedPinAttempts | Failure;

export type ClientJoinCommunityResponse = Success | GateCheckFailed | PinRequired | PinIncorrect | TooManyFailedPinAttempts | Failure;
