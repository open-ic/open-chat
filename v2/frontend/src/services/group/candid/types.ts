import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = string;
export interface AddParticipantsArgs {
  'allow_blocked_users' : boolean,
  'user_ids' : Array<UserId>,
}
export interface AddParticipantsFailedResult {
  'errors' : Array<UserId>,
  'users_blocked_from_group' : Array<UserId>,
  'users_who_blocked_request' : Array<UserId>,
  'users_already_in_group' : Array<UserId>,
}
export interface AddParticipantsPartialSuccessResult {
  'errors' : Array<UserId>,
  'users_blocked_from_group' : Array<UserId>,
  'users_added' : Array<UserId>,
  'users_who_blocked_request' : Array<UserId>,
  'users_already_in_group' : Array<UserId>,
}
export type AddParticipantsResponse = {
    'Failed' : AddParticipantsFailedResult
  } |
  { 'PartialSuccess' : AddParticipantsPartialSuccessResult } |
  { 'CallerNotInGroup' : null } |
  { 'NotAuthorized' : null } |
  { 'Success' : null } |
  { 'ParticipantLimitReached' : number };
export interface Alert {
  'id' : string,
  'details' : AlertDetails,
  'elapsed' : Milliseconds,
}
export type AlertDetails = { 'GroupDeleted' : GroupDeletedAlert } |
  { 'CryptocurrencyDepositReceived' : CryptocurrencyDeposit } |
  { 'RemovedFromGroup' : RemovedFromGroupAlert } |
  { 'BlockedFromGroup' : RemovedFromGroupAlert };
export type AlertId = { 'Internal' : number } |
  { 'GroupDeleted' : ChatId };
export interface AudioContent {
  'mime_type' : string,
  'blob_reference' : [] | [BlobReference],
  'caption' : [] | [string],
}
export interface Avatar {
  'id' : bigint,
  'data' : Array<number>,
  'mime_type' : string,
}
export interface AvatarChanged {
  'changed_by' : UserId,
  'previous_avatar' : [] | [bigint],
  'new_avatar' : bigint,
}
export interface BlobReference {
  'blob_id' : bigint,
  'canister_id' : CanisterId,
}
export type BlockHeight = bigint;
export interface BlockUserArgs { 'user_id' : UserId }
export type BlockUserResponse = { 'GroupNotPublic' : null } |
  { 'CannotBlockOwner' : null } |
  { 'UserNotInGroup' : null } |
  { 'CallerNotInGroup' : null } |
  { 'NotAuthorized' : null } |
  { 'Success' : null } |
  { 'InternalError' : string } |
  { 'CannotBlockSelf' : null };
export type CanisterCreationStatus = { 'InProgress' : null } |
  { 'Created' : null } |
  { 'Pending' : null };
export type CanisterId = Principal;
export type CanisterUpgradeStatus = { 'Required' : null } |
  { 'NotRequired' : null } |
  { 'InProgress' : null };
export interface CanisterWasm { 'version' : Version, 'module' : Array<number> }
export type ChatId = CanisterId;
export type ChatSummary = { 'Group' : GroupChatSummary } |
  { 'Direct' : DirectChatSummary };
export type ChatSummaryUpdates = { 'Group' : GroupChatSummaryUpdates } |
  { 'Direct' : DirectChatSummaryUpdates };
export interface CompletedCyclesDeposit {
  'from' : CanisterId,
  'cycles' : Cycles,
}
export interface CompletedCyclesTransfer {
  'recipient' : UserId,
  'sender' : UserId,
  'cycles' : Cycles,
}
export interface CompletedCyclesWithdrawal {
  'to' : CanisterId,
  'cycles' : Cycles,
}
export interface CompletedICPDeposit {
  'memo' : bigint,
  'fee_e8s' : bigint,
  'amount_e8s' : bigint,
  'from_address' : string,
  'block_height' : BlockHeight,
}
export interface CompletedICPTransfer {
  'memo' : bigint,
  'recipient' : UserId,
  'fee_e8s' : bigint,
  'sender' : UserId,
  'amount_e8s' : bigint,
  'block_height' : BlockHeight,
}
export interface CompletedICPWithdrawal {
  'to' : string,
  'memo' : bigint,
  'fee_e8s' : bigint,
  'amount_e8s' : bigint,
  'block_height' : BlockHeight,
}
export interface ConfirmationCodeSms {
  'confirmation_code' : string,
  'phone_number' : string,
}
export type Cryptocurrency = { 'ICP' : null } |
  { 'Cycles' : null };
export interface CryptocurrencyAccount {
  'currency' : Cryptocurrency,
  'address' : string,
}
export interface CryptocurrencyContent {
  'caption' : [] | [string],
  'transfer' : CryptocurrencyTransfer,
}
export type CryptocurrencyDeposit = { 'ICP' : ICPDeposit } |
  { 'Cycles' : CyclesDeposit };
export type CryptocurrencyTransaction = { 'Deposit' : CryptocurrencyDeposit } |
  { 'Withdrawal' : CryptocurrencyWithdrawal } |
  { 'Transfer' : CryptocurrencyTransfer };
export type CryptocurrencyTransfer = { 'ICP' : ICPTransfer } |
  { 'Cycles' : CyclesTransfer };
export type CryptocurrencyWithdrawal = { 'ICP' : ICPWithdrawal } |
  { 'Cycles' : CyclesWithdrawal };
export type Cycles = bigint;
export type CyclesDeposit = { 'Completed' : CompletedCyclesDeposit };
export type CyclesTransfer = { 'Failed' : FailedCyclesTransfer } |
  { 'Completed' : CompletedCyclesTransfer } |
  { 'Pending' : PendingCyclesTransfer };
export type CyclesWithdrawal = { 'Failed' : FailedCyclesWithdrawal } |
  { 'Completed' : CompletedCyclesWithdrawal } |
  { 'Pending' : PendingCyclesWithdrawal };
export type DeleteGroupArgs = {};
export type DeleteGroupResponse = { 'NotAuthorized' : null } |
  { 'Success' : null } |
  { 'InternalError' : null };
export interface DeleteMessagesArgs { 'message_ids' : Array<MessageId> }
export type DeleteMessagesResponse = { 'CallerNotInGroup' : null } |
  { 'Success' : null };
export interface DeletedContent {
  'timestamp' : TimestampMillis,
  'deleted_by' : UserId,
}
export type DirectChatCreated = {};
export type DirectChatEvent = { 'MessageReactionRemoved' : UpdatedMessage } |
  { 'MessageReactionAdded' : UpdatedMessage } |
  { 'Message' : Message } |
  { 'MessageDeleted' : UpdatedMessage } |
  { 'DirectChatCreated' : DirectChatCreated } |
  { 'MessageEdited' : UpdatedMessage };
export interface DirectChatEventWrapper {
  'event' : DirectChatEvent,
  'timestamp' : TimestampMillis,
  'index' : EventIndex,
}
export interface DirectChatSummary {
  'date_created' : TimestampMillis,
  'them' : UserId,
  'notifications_muted' : boolean,
  'read_by_me' : Array<MessageIndexRange>,
  'latest_event_index' : EventIndex,
  'read_by_them' : Array<MessageIndexRange>,
  'latest_message' : MessageEventWrapper,
}
export interface DirectChatSummaryUpdates {
  'notifications_muted' : [] | [boolean],
  'read_by_me' : [] | [Array<MessageIndexRange>],
  'latest_event_index' : [] | [EventIndex],
  'chat_id' : ChatId,
  'read_by_them' : [] | [Array<MessageIndexRange>],
  'latest_message' : [] | [MessageEventWrapper],
}
export interface DirectMessageNotification {
  'sender' : UserId,
  'message' : Message,
  'sender_name' : string,
}
export interface EditMessageArgs {
  'content' : MessageContent,
  'message_id' : MessageId,
}
export type EditMessageResponse = { 'MessageNotFound' : null } |
  { 'CallerNotInGroup' : null } |
  { 'Success' : null };
export type EventIndex = number;
export interface EventsArgs {
  'max_messages' : number,
  'max_events' : number,
  'ascending' : boolean,
  'start_index' : EventIndex,
}
export interface EventsByIndexArgs { 'events' : Array<EventIndex> }
export interface EventsRangeArgs {
  'to_index' : EventIndex,
  'from_index' : EventIndex,
}
export type EventsResponse = { 'CallerNotInGroup' : null } |
  { 'Success' : EventsSuccessResult };
export interface EventsSuccessResult {
  'affected_events' : Array<GroupChatEventWrapper>,
  'events' : Array<GroupChatEventWrapper>,
}
export interface EventsWindowArgs {
  'mid_point' : MessageIndex,
  'max_messages' : number,
  'max_events' : number,
}
export interface FailedCyclesTransfer {
  'error_message' : string,
  'recipient' : UserId,
  'cycles' : Cycles,
}
export interface FailedCyclesWithdrawal {
  'to' : CanisterId,
  'error_message' : string,
  'cycles' : Cycles,
}
export interface FailedICPTransfer {
  'memo' : bigint,
  'error_message' : string,
  'recipient' : UserId,
  'fee_e8s' : bigint,
  'amount_e8s' : bigint,
}
export interface FailedICPWithdrawal {
  'to' : string,
  'memo' : bigint,
  'error_message' : string,
  'fee_e8s' : bigint,
  'amount_e8s' : bigint,
}
export interface FieldTooLongResult {
  'length_provided' : number,
  'max_length' : number,
}
export interface FileContent {
  'name' : string,
  'mime_type' : string,
  'file_size' : number,
  'blob_reference' : [] | [BlobReference],
  'caption' : [] | [string],
}
export interface GroupChatCreated {
  'name' : string,
  'description' : string,
  'created_by' : UserId,
}
export type GroupChatEvent = { 'MessageReactionRemoved' : UpdatedMessage } |
  { 'ParticipantJoined' : ParticipantJoined } |
  { 'GroupDescriptionChanged' : GroupDescriptionChanged } |
  { 'GroupChatCreated' : GroupChatCreated } |
  { 'ParticipantsPromotedToAdmin' : ParticipantsPromotedToAdmin } |
  { 'UsersBlocked' : UsersBlocked } |
  { 'MessageReactionAdded' : UpdatedMessage } |
  { 'ParticipantsRemoved' : ParticipantsRemoved } |
  { 'Message' : Message } |
  { 'ParticipantsDismissedAsAdmin' : ParticipantsDismissedAsAdmin } |
  { 'UsersUnblocked' : UsersUnblocked } |
  { 'ParticipantLeft' : ParticipantLeft } |
  { 'MessageDeleted' : UpdatedMessage } |
  { 'GroupNameChanged' : GroupNameChanged } |
  { 'OwnershipTransferred' : OwnershipTransferred } |
  { 'MessageEdited' : UpdatedMessage } |
  { 'AvatarChanged' : AvatarChanged } |
  { 'ParticipantsAdded' : ParticipantsAdded };
export interface GroupChatEventWrapper {
  'event' : GroupChatEvent,
  'timestamp' : TimestampMillis,
  'index' : EventIndex,
}
export interface GroupChatSummary {
  'is_public' : boolean,
  'min_visible_event_index' : EventIndex,
  'name' : string,
  'role' : Role,
  'notifications_muted' : boolean,
  'description' : string,
  'last_updated' : TimestampMillis,
  'read_by_me' : Array<MessageIndexRange>,
  'joined' : TimestampMillis,
  'avatar_id' : [] | [bigint],
  'latest_event_index' : EventIndex,
  'min_visible_message_index' : MessageIndex,
  'chat_id' : ChatId,
  'participant_count' : number,
  'latest_message' : [] | [MessageEventWrapper],
}
export interface GroupChatSummaryUpdates {
  'name' : [] | [string],
  'role' : [] | [Role],
  'notifications_muted' : [] | [boolean],
  'description' : [] | [string],
  'last_updated' : TimestampMillis,
  'read_by_me' : [] | [Array<MessageIndexRange>],
  'avatar_id' : [] | [bigint],
  'latest_event_index' : [] | [EventIndex],
  'chat_id' : ChatId,
  'participant_count' : [] | [number],
  'latest_message' : [] | [MessageEventWrapper],
}
export interface GroupDeletedAlert { 'deleted_by' : UserId, 'chat_id' : ChatId }
export interface GroupDescriptionChanged {
  'new_description' : string,
  'previous_description' : string,
  'changed_by' : UserId,
}
export interface GroupMessageNotification {
  'sender' : UserId,
  'message' : Message,
  'sender_name' : string,
  'chat_id' : ChatId,
  'group_name' : string,
}
export interface GroupNameChanged {
  'changed_by' : UserId,
  'new_name' : string,
  'previous_name' : string,
}
export interface GroupReplyContext { 'event_index' : EventIndex }
export type ICPDeposit = { 'Completed' : CompletedICPDeposit };
export type ICPTransfer = { 'Failed' : FailedICPTransfer } |
  { 'Completed' : CompletedICPTransfer } |
  { 'Pending' : PendingICPTransfer };
export type ICPWithdrawal = { 'Failed' : FailedICPWithdrawal } |
  { 'Completed' : CompletedICPWithdrawal } |
  { 'Pending' : PendingICPWithdrawal };
export interface ImageContent {
  'height' : number,
  'mime_type' : string,
  'blob_reference' : [] | [BlobReference],
  'thumbnail_data' : string,
  'caption' : [] | [string],
  'width' : number,
}
export interface IndexedNotification {
  'value' : NotificationEnvelope,
  'index' : bigint,
}
export interface MakeAdminArgs { 'user_id' : UserId }
export type MakeAdminResponse = { 'UserNotInGroup' : null } |
  { 'CallerNotInGroup' : null } |
  { 'NotAuthorized' : null } |
  { 'Success' : null };
export interface Message {
  'content' : MessageContent,
  'edited' : boolean,
  'sender' : UserId,
  'message_id' : MessageId,
  'replies_to' : [] | [ReplyContext],
  'reactions' : Array<[string, Array<UserId>]>,
  'message_index' : MessageIndex,
}
export type MessageContent = { 'File' : FileContent } |
  { 'Text' : TextContent } |
  { 'Image' : ImageContent } |
  { 'Cryptocurrency' : CryptocurrencyContent } |
  { 'Audio' : AudioContent } |
  { 'Video' : VideoContent } |
  { 'Deleted' : DeletedContent };
export interface MessageEventWrapper {
  'event' : Message,
  'timestamp' : TimestampMillis,
  'index' : EventIndex,
}
export type MessageId = bigint;
export type MessageIndex = number;
export interface MessageIndexRange {
  'to' : MessageIndex,
  'from' : MessageIndex,
}
export interface MessageMatch {
  'content' : MessageContent,
  'sender' : UserId,
  'score' : number,
  'chat_id' : ChatId,
  'message_index' : MessageIndex,
}
export type Milliseconds = bigint;
export type NightMode = { 'On' : null } |
  { 'Off' : null } |
  { 'Auto' : null };
export type Notification = {
    'DirectMessageNotification' : DirectMessageNotification
  } |
  { 'GroupMessageNotification' : GroupMessageNotification } |
  { 'V1GroupMessageNotification' : V1GroupMessageNotification } |
  { 'V1DirectMessageNotification' : V1DirectMessageNotification };
export interface NotificationEnvelope {
  'notification' : Notification,
  'recipients' : Array<UserId>,
}
export interface OptionalUserPreferences {
  'large_emoji' : [] | [boolean],
  'notification_preferences' : [] | [
    {
      'private_group_chats' : [] | [boolean],
      'direct_chats' : [] | [boolean],
      'silent' : [] | [boolean],
      'public_group_chats' : [] | [boolean],
      'vibrate' : [] | [boolean],
    }
  ],
  'night_mode' : [] | [NightMode],
  'language' : [] | [string],
  'enter_key_sends' : [] | [boolean],
  'generate_link_previews' : [] | [boolean],
  'use_system_emoji' : [] | [boolean],
  'enable_animations' : [] | [boolean],
}
export interface OwnershipTransferred {
  'old_owner' : UserId,
  'new_owner' : UserId,
}
export interface PartialUserSummary {
  'username' : [] | [string],
  'user_id' : UserId,
  'avatar_id' : [] | [bigint],
  'seconds_since_last_online' : number,
}
export interface Participant {
  'role' : Role,
  'user_id' : UserId,
  'date_added' : TimestampMillis,
}
export interface ParticipantJoined { 'user_id' : UserId }
export interface ParticipantLeft { 'user_id' : UserId }
export interface ParticipantsAdded {
  'user_ids' : Array<UserId>,
  'added_by' : UserId,
}
export interface ParticipantsDismissedAsAdmin {
  'user_ids' : Array<UserId>,
  'dismissed_by' : UserId,
}
export interface ParticipantsPromotedToAdmin {
  'user_ids' : Array<UserId>,
  'promoted_by' : UserId,
}
export interface ParticipantsRemoved {
  'user_ids' : Array<UserId>,
  'removed_by' : UserId,
}
export interface PendingCyclesTransfer {
  'recipient' : UserId,
  'cycles' : Cycles,
}
export interface PendingCyclesWithdrawal {
  'to' : CanisterId,
  'cycles' : Cycles,
}
export interface PendingICPTransfer {
  'memo' : [] | [bigint],
  'recipient' : UserId,
  'fee_e8s' : [] | [bigint],
  'amount_e8s' : bigint,
}
export interface PendingICPWithdrawal {
  'to' : string,
  'memo' : [] | [bigint],
  'fee_e8s' : [] | [bigint],
  'amount_e8s' : bigint,
}
export interface PutChunkArgs {
  'total_chunks' : number,
  'blob_id' : bigint,
  'mime_type' : string,
  'bytes' : Array<number>,
  'index' : number,
}
export type PutChunkResponse = { 'ChunkAlreadyExists' : null } |
  { 'Full' : null } |
  { 'CallerNotInGroup' : null } |
  { 'BlobAlreadyExists' : null } |
  { 'Success' : null } |
  { 'ChunkTooBig' : null };
export interface RemoveAdminArgs { 'user_id' : UserId }
export type RemoveAdminResponse = { 'UserNotInGroup' : null } |
  { 'CallerNotInGroup' : null } |
  { 'NotAuthorized' : null } |
  { 'Success' : null } |
  { 'CannotRemoveSelf' : null };
export interface RemoveParticipantArgs { 'user_id' : UserId }
export type RemoveParticipantResponse = { 'UserNotInGroup' : null } |
  { 'CallerNotInGroup' : null } |
  { 'NotAuthorized' : null } |
  { 'Success' : null } |
  { 'CannotRemoveOwner' : null } |
  { 'CannotRemoveSelf' : null } |
  { 'InternalError' : string };
export interface RemovedFromGroupAlert {
  'chat_id' : ChatId,
  'removed_by' : UserId,
}
export interface ReplyContext {
  'chat_id_if_other' : [] | [ChatId],
  'event_index' : EventIndex,
}
export type Role = { 'Participant' : null } |
  { 'Admin' : null };
export interface SearchMessagesArgs {
  'max_results' : number,
  'search_term' : string,
}
export type SearchMessagesResponse = { 'TermTooShort' : number } |
  { 'CallerNotInGroup' : null } |
  { 'Success' : SearchMessagesSuccessResult } |
  { 'TermTooLong' : number } |
  { 'InvalidTerm' : null };
export interface SearchMessagesSuccessResult { 'matches' : Array<MessageMatch> }
export type SelectedInitialArgs = {};
export type SelectedInitialResponse = { 'CallerNotInGroup' : null } |
  { 'Success' : SelectedInitialSuccess };
export interface SelectedInitialSuccess {
  'participants' : Array<Participant>,
  'blocked_users' : Array<UserId>,
  'latest_event_index' : EventIndex,
}
export interface SelectedUpdatesArgs { 'updates_since' : EventIndex }
export type SelectedUpdatesResponse = { 'CallerNotInGroup' : null } |
  { 'Success' : SelectedUpdatesSuccess } |
  { 'SuccessNoUpdates' : null };
export interface SelectedUpdatesSuccess {
  'blocked_users_removed' : Array<UserId>,
  'participants_added_or_updated' : Array<Participant>,
  'participants_removed' : Array<UserId>,
  'latest_event_index' : EventIndex,
  'blocked_users_added' : Array<UserId>,
}
export interface SendMessageArgs {
  'content' : MessageContent,
  'sender_name' : string,
  'message_id' : MessageId,
  'replies_to' : [] | [GroupReplyContext],
}
export type SendMessageResponse = { 'CallerNotInGroup' : null } |
  {
    'Success' : {
      'timestamp' : TimestampMillis,
      'event_index' : EventIndex,
      'message_index' : MessageIndex,
    }
  };
export interface Subscription {
  'value' : SubscriptionInfo,
  'last_active' : TimestampMillis,
}
export interface SubscriptionInfo {
  'endpoint' : string,
  'keys' : SubscriptionKeys,
}
export interface SubscriptionKeys { 'auth' : string, 'p256dh' : string }
export type SummaryArgs = {};
export type SummaryResponse = { 'CallerNotInGroup' : null } |
  { 'Success' : GroupChatSummary } |
  { 'SuccessNoUpdates' : null };
export interface SummaryUpdatesArgs { 'updates_since' : TimestampMillis }
export type SummaryUpdatesResponse = { 'CallerNotInGroup' : null } |
  { 'Success' : SummaryUpdatesSuccess } |
  { 'SuccessNoUpdates' : null };
export interface SummaryUpdatesSuccess { 'updates' : GroupChatSummaryUpdates }
export interface TextContent { 'text' : string }
export type TimestampMillis = bigint;
export type TimestampNanos = bigint;
export interface ToggleReactionArgs {
  'message_id' : MessageId,
  'reaction' : string,
}
export type ToggleReactionResponse = { 'MessageNotFound' : null } |
  { 'CallerNotInGroup' : null } |
  { 'InvalidReaction' : null } |
  { 'Added' : EventIndex } |
  { 'Removed' : EventIndex };
export type Transaction = { 'Cryptocurrency' : CryptocurrencyTransaction };
export type TransactionStatus = { 'Failed' : string } |
  { 'Complete' : null } |
  { 'Pending' : null };
export interface TransactionWrapper {
  'transaction' : Transaction,
  'timestamp' : TimestampMillis,
  'index' : number,
}
export interface TransferOwnershipArgs { 'new_owner' : UserId }
export type TransferOwnershipResponse = { 'UserNotInGroup' : null } |
  { 'CallerNotInGroup' : null } |
  { 'NotAuthorized' : null } |
  { 'Success' : null };
export interface UnblockUserArgs { 'user_id' : UserId }
export type UnblockUserResponse = { 'GroupNotPublic' : null } |
  { 'CannotUnblockSelf' : null } |
  { 'CallerNotInGroup' : null } |
  { 'NotAuthorized' : null } |
  { 'Success' : null };
export interface UpdateGroupArgs {
  'name' : string,
  'description' : string,
  'avatar' : [] | [Avatar],
}
export type UpdateGroupResponse = {
    'DescriptionTooLong' : FieldTooLongResult
  } |
  { 'Unchanged' : null } |
  { 'CallerNotInGroup' : null } |
  { 'NotAuthorized' : null } |
  { 'Success' : null } |
  { 'NameTooLong' : FieldTooLongResult } |
  { 'NameTaken' : null } |
  { 'InternalError' : null };
export interface UpdatedMessage {
  'message_id' : MessageId,
  'event_index' : EventIndex,
}
export type UserId = CanisterId;
export interface UserSummary {
  'username' : string,
  'user_id' : UserId,
  'avatar_id' : [] | [bigint],
  'seconds_since_last_online' : number,
}
export interface UsersBlocked {
  'user_ids' : Array<UserId>,
  'blocked_by' : UserId,
}
export interface UsersUnblocked {
  'user_ids' : Array<UserId>,
  'unblocked_by' : UserId,
}
export type V1ChatId = bigint;
export interface V1CyclesContent {
  'caption' : [] | [string],
  'amount' : Cycles,
}
export interface V1DirectMessageNotification {
  'sender' : UserId,
  'message' : V1Message,
  'sender_name' : string,
  'chat_id' : string,
}
export interface V1FileContent {
  'blob_size' : number,
  'blob_id' : string,
  'name' : string,
  'mime_type' : string,
  'caption' : [] | [string],
  'chunk_size' : number,
  'blob_deleted' : boolean,
}
export type V1GroupId = bigint;
export interface V1GroupMessageNotification {
  'sender' : UserId,
  'message' : V1Message,
  'sender_name' : string,
  'chat_id' : string,
  'group_name' : string,
}
export interface V1MediaContent {
  'height' : number,
  'blob_size' : number,
  'blob_id' : string,
  'mime_type' : string,
  'thumbnail_data' : string,
  'caption' : [] | [string],
  'width' : number,
  'chunk_size' : number,
  'blob_deleted' : boolean,
}
export interface V1Message {
  'id' : number,
  'content' : V1MessageContent,
  'sender' : UserId,
  'timestamp' : TimestampMillis,
  'replies_to' : [] | [V1ReplyContext],
  'client_message_id' : string,
}
export type V1MessageContent = { 'File' : V1FileContent } |
  { 'Text' : V1TextContent } |
  { 'Media' : V1MediaContent } |
  { 'Cycles' : V1CyclesContent };
export interface V1ReplyContext {
  'content' : V1MessageContent,
  'user_id' : UserId,
  'chat_id' : V1ChatId,
  'message_id' : number,
}
export interface V1TextContent { 'text' : string }
export interface Version {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export interface VideoContent {
  'height' : number,
  'image_blob_reference' : [] | [BlobReference],
  'video_blob_reference' : [] | [BlobReference],
  'mime_type' : string,
  'thumbnail_data' : string,
  'caption' : [] | [string],
  'width' : number,
}
export interface _SERVICE {
  'add_participants' : (arg_0: AddParticipantsArgs) => Promise<
      AddParticipantsResponse
    >,
  'block_user' : (arg_0: BlockUserArgs) => Promise<BlockUserResponse>,
  'delete_group' : (arg_0: DeleteGroupArgs) => Promise<DeleteGroupResponse>,
  'delete_messages' : (arg_0: DeleteMessagesArgs) => Promise<
      DeleteMessagesResponse
    >,
  'edit_message' : (arg_0: EditMessageArgs) => Promise<EditMessageResponse>,
  'events' : (arg_0: EventsArgs) => Promise<EventsResponse>,
  'events_by_index' : (arg_0: EventsByIndexArgs) => Promise<EventsResponse>,
  'events_range' : (arg_0: EventsRangeArgs) => Promise<EventsResponse>,
  'events_window' : (arg_0: EventsWindowArgs) => Promise<EventsResponse>,
  'make_admin' : (arg_0: MakeAdminArgs) => Promise<MakeAdminResponse>,
  'put_chunk' : (arg_0: PutChunkArgs) => Promise<PutChunkResponse>,
  'remove_admin' : (arg_0: RemoveAdminArgs) => Promise<RemoveAdminResponse>,
  'remove_participant' : (arg_0: RemoveParticipantArgs) => Promise<
      RemoveParticipantResponse
    >,
  'search_messages' : (arg_0: SearchMessagesArgs) => Promise<
      SearchMessagesResponse
    >,
  'selected_initial' : (arg_0: SelectedInitialArgs) => Promise<
      SelectedInitialResponse
    >,
  'selected_updates' : (arg_0: SelectedUpdatesArgs) => Promise<
      SelectedUpdatesResponse
    >,
  'send_message' : (arg_0: SendMessageArgs) => Promise<SendMessageResponse>,
  'summary' : (arg_0: SummaryArgs) => Promise<SummaryResponse>,
  'summary_updates' : (arg_0: SummaryUpdatesArgs) => Promise<
      SummaryUpdatesResponse
    >,
  'toggle_reaction' : (arg_0: ToggleReactionArgs) => Promise<
      ToggleReactionResponse
    >,
  'transfer_ownership' : (arg_0: TransferOwnershipArgs) => Promise<
      TransferOwnershipResponse
    >,
  'unblock_user' : (arg_0: UnblockUserArgs) => Promise<UnblockUserResponse>,
  'update_group' : (arg_0: UpdateGroupArgs) => Promise<UpdateGroupResponse>,
}
