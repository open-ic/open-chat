import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AcceptSwapSuccess { 'token1_txn_in' : bigint }
export type AccessGate = { 'VerifiedCredential' : VerifiedCredentialGate } |
  { 'SnsNeuron' : SnsNeuronGate } |
  { 'TokenBalance' : TokenBalanceGate } |
  { 'DiamondMember' : null } |
  { 'Payment' : PaymentGate };
export type AccessGateUpdate = { 'NoChange' : null } |
  { 'SetToNone' : null } |
  { 'SetToSome' : AccessGate };
export interface AccessTokenArgs {
  'chat' : Chat,
  'token_type' : AccessTokenType,
}
export type AccessTokenResponse = { 'NotAuthorized' : null } |
  { 'Success' : string } |
  { 'InternalError' : string };
export type AccessTokenType = { 'JoinVideoCall' : null } |
  { 'StartVideoCall' : null } |
  { 'StartVideoCallV2' : { 'call_type' : VideoCallType } } |
  { 'MarkVideoCallAsEnded' : null };
export type AccessorId = Principal;
export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export type AccountIdentifier = Uint8Array | number[];
export interface AddedToChannelNotification {
  'channel_id' : ChannelId,
  'community_id' : CommunityId,
  'added_by_name' : string,
  'added_by' : UserId,
  'channel_name' : string,
  'community_avatar_id' : [] | [bigint],
  'added_by_display_name' : [] | [string],
  'community_name' : string,
  'channel_avatar_id' : [] | [bigint],
}
export interface AudioContent {
  'mime_type' : string,
  'blob_reference' : [] | [BlobReference],
  'caption' : [] | [string],
}
export interface AvatarChanged {
  'changed_by' : UserId,
  'previous_avatar' : [] | [bigint],
  'new_avatar' : [] | [bigint],
}
export interface BannerChanged {
  'new_banner' : [] | [bigint],
  'changed_by' : UserId,
  'previous_banner' : [] | [bigint],
}
export interface BlobReference {
  'blob_id' : bigint,
  'canister_id' : CanisterId,
}
export type BlockIndex = bigint;
export interface BuildVersion {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export interface CallParticipant {
  'user_id' : UserId,
  'joined' : TimestampMillis,
}
export type CanisterId = Principal;
export type CanisterUpgradeStatus = { 'NotRequired' : null } |
  { 'InProgress' : null };
export interface CanisterWasm {
  'compressed' : boolean,
  'version' : BuildVersion,
  'module' : Uint8Array | number[],
}
export type ChannelId = bigint;
export interface ChannelMatch {
  'id' : ChannelId,
  'subtype' : [] | [GroupSubtype],
  'gate' : [] | [AccessGate],
  'name' : string,
  'description' : string,
  'avatar_id' : [] | [bigint],
  'member_count' : number,
}
export interface ChannelMessageNotification {
  'channel_id' : ChannelId,
  'community_id' : CommunityId,
  'image_url' : [] | [string],
  'sender_display_name' : [] | [string],
  'sender' : UserId,
  'channel_name' : string,
  'community_avatar_id' : [] | [bigint],
  'community_name' : string,
  'sender_name' : string,
  'message_text' : [] | [string],
  'message_type' : string,
  'event_index' : EventIndex,
  'thread_root_message_index' : [] | [MessageIndex],
  'channel_avatar_id' : [] | [bigint],
  'crypto_transfer' : [] | [NotificationCryptoTransferDetails],
  'message_index' : MessageIndex,
}
export interface ChannelMessageTippedNotification {
  'tip' : string,
  'channel_id' : ChannelId,
  'tipped_by_display_name' : [] | [string],
  'community_id' : CommunityId,
  'message_event_index' : EventIndex,
  'channel_name' : string,
  'tipped_by' : UserId,
  'community_avatar_id' : [] | [bigint],
  'community_name' : string,
  'tipped_by_name' : string,
  'thread_root_message_index' : [] | [MessageIndex],
  'channel_avatar_id' : [] | [bigint],
  'message_index' : MessageIndex,
}
export interface ChannelReactionAddedNotification {
  'channel_id' : ChannelId,
  'community_id' : CommunityId,
  'added_by_name' : string,
  'message_event_index' : EventIndex,
  'added_by' : UserId,
  'channel_name' : string,
  'community_avatar_id' : [] | [bigint],
  'added_by_display_name' : [] | [string],
  'community_name' : string,
  'thread_root_message_index' : [] | [MessageIndex],
  'channel_avatar_id' : [] | [bigint],
  'reaction' : Reaction,
  'message_index' : MessageIndex,
}
export type Chat = { 'Group' : ChatId } |
  { 'Channel' : [CommunityId, ChannelId] } |
  { 'Direct' : ChatId };
export type ChatEvent = { 'Empty' : null } |
  { 'ParticipantJoined' : ParticipantJoined } |
  { 'GroupDescriptionChanged' : GroupDescriptionChanged } |
  { 'GroupChatCreated' : GroupChatCreated } |
  { 'MessagePinned' : MessagePinned } |
  { 'UsersInvited' : UsersInvited } |
  { 'UsersBlocked' : UsersBlocked } |
  { 'MessageUnpinned' : MessageUnpinned } |
  { 'ParticipantsRemoved' : ParticipantsRemoved } |
  { 'GroupVisibilityChanged' : GroupVisibilityChanged } |
  { 'Message' : Message } |
  { 'PermissionsChanged' : PermissionsChanged } |
  { 'MembersAddedToDefaultChannel' : MembersAddedToDefaultChannel } |
  { 'ChatFrozen' : GroupFrozen } |
  { 'GroupInviteCodeChanged' : GroupInviteCodeChanged } |
  { 'UsersUnblocked' : UsersUnblocked } |
  { 'ChatUnfrozen' : GroupUnfrozen } |
  { 'ParticipantLeft' : ParticipantLeft } |
  { 'GroupRulesChanged' : GroupRulesChanged } |
  { 'GroupNameChanged' : GroupNameChanged } |
  { 'GroupGateUpdated' : GroupGateUpdated } |
  { 'RoleChanged' : RoleChanged } |
  { 'EventsTimeToLiveUpdated' : EventsTimeToLiveUpdated } |
  { 'DirectChatCreated' : DirectChatCreated } |
  { 'AvatarChanged' : AvatarChanged } |
  { 'ParticipantsAdded' : ParticipantsAdded };
export interface ChatEventWrapper {
  'event' : ChatEvent,
  'timestamp' : TimestampMillis,
  'index' : EventIndex,
  'correlation_id' : bigint,
  'expires_at' : [] | [TimestampMillis],
}
export interface ChatEventsArgs { 'requests' : Array<ChatEventsArgsInner> }
export interface ChatEventsArgsInner {
  'context' : EventsContext,
  'args' : {
      'Page' : {
        'max_messages' : number,
        'max_events' : number,
        'ascending' : boolean,
        'start_index' : EventIndex,
      }
    } |
    { 'ByIndex' : { 'events' : Uint32Array | number[] } } |
    {
      'Window' : {
        'mid_point' : MessageIndex,
        'max_messages' : number,
        'max_events' : number,
      }
    },
  'latest_known_update' : [] | [TimestampMillis],
}
export type ChatEventsResponse = {
    'Success' : {
      'responses' : Array<ChatEventsResponseInner>,
      'timestamp' : TimestampMillis,
    }
  };
export type ChatEventsResponseInner = {
    'ReplicaNotUpToDate' : TimestampMillis
  } |
  { 'NotFound' : null } |
  { 'Success' : EventsSuccessResult } |
  { 'InternalError' : string };
export type ChatId = CanisterId;
export interface ChatMetrics {
  'prize_winner_messages' : bigint,
  'audio_messages' : bigint,
  'chat_messages' : bigint,
  'edits' : bigint,
  'icp_messages' : bigint,
  'last_active' : TimestampMillis,
  'giphy_messages' : bigint,
  'deleted_messages' : bigint,
  'file_messages' : bigint,
  'poll_votes' : bigint,
  'text_messages' : bigint,
  'message_reminders' : bigint,
  'image_messages' : bigint,
  'replies' : bigint,
  'video_messages' : bigint,
  'sns1_messages' : bigint,
  'polls' : bigint,
  'proposals' : bigint,
  'reported_messages' : bigint,
  'ckbtc_messages' : bigint,
  'reactions' : bigint,
  'kinic_messages' : bigint,
  'custom_type_messages' : bigint,
  'prize_messages' : bigint,
}
export interface CommunityCanisterChannelSummary {
  'latest_message_sender_display_name' : [] | [string],
  'channel_id' : ChannelId,
  'is_public' : boolean,
  'video_call_in_progress' : [] | [VideoCall],
  'metrics' : ChatMetrics,
  'subtype' : [] | [GroupSubtype],
  'permissions_v2' : GroupPermissions,
  'date_last_pinned' : [] | [TimestampMillis],
  'min_visible_event_index' : EventIndex,
  'gate' : [] | [AccessGate],
  'name' : string,
  'latest_message_index' : [] | [MessageIndex],
  'description' : string,
  'events_ttl' : [] | [Milliseconds],
  'last_updated' : TimestampMillis,
  'avatar_id' : [] | [bigint],
  'membership' : [] | [GroupMembership],
  'latest_event_index' : EventIndex,
  'history_visible_to_new_joiners' : boolean,
  'min_visible_message_index' : MessageIndex,
  'member_count' : number,
  'events_ttl_last_updated' : TimestampMillis,
  'latest_message' : [] | [MessageEventWrapper],
}
export interface CommunityCanisterChannelSummaryUpdates {
  'latest_message_sender_display_name' : [] | [string],
  'channel_id' : ChannelId,
  'is_public' : [] | [boolean],
  'video_call_in_progress' : VideoCallUpdates,
  'metrics' : [] | [ChatMetrics],
  'subtype' : GroupSubtypeUpdate,
  'permissions_v2' : [] | [GroupPermissions],
  'date_last_pinned' : [] | [TimestampMillis],
  'gate' : AccessGateUpdate,
  'name' : [] | [string],
  'latest_message_index' : [] | [MessageIndex],
  'description' : [] | [string],
  'events_ttl' : EventsTimeToLiveUpdate,
  'last_updated' : TimestampMillis,
  'avatar_id' : DocumentIdUpdate,
  'membership' : [] | [GroupMembershipUpdates],
  'latest_event_index' : [] | [EventIndex],
  'updated_events' : Array<[[] | [number], number, bigint]>,
  'member_count' : [] | [number],
  'events_ttl_last_updated' : [] | [TimestampMillis],
  'latest_message' : [] | [MessageEventWrapper],
}
export interface CommunityCanisterCommunitySummary {
  'is_public' : boolean,
  'permissions' : CommunityPermissions,
  'community_id' : CommunityId,
  'metrics' : ChatMetrics,
  'gate' : [] | [AccessGate],
  'name' : string,
  'description' : string,
  'last_updated' : TimestampMillis,
  'channels' : Array<CommunityCanisterChannelSummary>,
  'user_groups' : Array<UserGroup>,
  'avatar_id' : [] | [bigint],
  'membership' : [] | [CommunityMembership],
  'local_user_index_canister_id' : CanisterId,
  'frozen' : [] | [FrozenGroupInfo],
  'latest_event_index' : EventIndex,
  'banner_id' : [] | [bigint],
  'member_count' : number,
  'primary_language' : string,
}
export interface CommunityCanisterCommunitySummaryUpdates {
  'is_public' : [] | [boolean],
  'permissions' : [] | [CommunityPermissions],
  'community_id' : CommunityId,
  'channels_updated' : Array<CommunityCanisterChannelSummaryUpdates>,
  'metrics' : [] | [ChatMetrics],
  'user_groups_deleted' : Uint32Array | number[],
  'gate' : AccessGateUpdate,
  'name' : [] | [string],
  'description' : [] | [string],
  'last_updated' : TimestampMillis,
  'channels_removed' : Array<ChannelId>,
  'user_groups' : Array<UserGroup>,
  'avatar_id' : DocumentIdUpdate,
  'channels_added' : Array<CommunityCanisterChannelSummary>,
  'membership' : [] | [CommunityMembershipUpdates],
  'frozen' : FrozenGroupUpdate,
  'latest_event_index' : [] | [EventIndex],
  'banner_id' : DocumentIdUpdate,
  'member_count' : [] | [number],
  'primary_language' : [] | [string],
}
export type CommunityId = CanisterId;
export interface CommunityMatch {
  'id' : CommunityId,
  'channel_count' : number,
  'gate' : [] | [AccessGate],
  'name' : string,
  'description' : string,
  'moderation_flags' : number,
  'score' : number,
  'avatar_id' : [] | [bigint],
  'banner_id' : [] | [bigint],
  'member_count' : number,
  'primary_language' : string,
}
export interface CommunityMember {
  'role' : CommunityRole,
  'user_id' : UserId,
  'display_name' : [] | [string],
  'date_added' : TimestampMillis,
}
export interface CommunityMembership {
  'role' : CommunityRole,
  'display_name' : [] | [string],
  'joined' : TimestampMillis,
  'rules_accepted' : boolean,
}
export interface CommunityMembershipUpdates {
  'role' : [] | [CommunityRole],
  'display_name' : TextUpdate,
  'rules_accepted' : [] | [boolean],
}
export type CommunityPermissionRole = { 'Owners' : null } |
  { 'Admins' : null } |
  { 'Members' : null };
export interface CommunityPermissions {
  'create_public_channel' : CommunityPermissionRole,
  'manage_user_groups' : CommunityPermissionRole,
  'update_details' : CommunityPermissionRole,
  'remove_members' : CommunityPermissionRole,
  'invite_users' : CommunityPermissionRole,
  'change_roles' : CommunityPermissionRole,
  'create_private_channel' : CommunityPermissionRole,
}
export type CommunityRole = { 'Member' : null } |
  { 'Admin' : null } |
  { 'Owner' : null };
export type CompletedCryptoTransaction = {
    'NNS' : NnsCompletedCryptoTransaction
  } |
  { 'ICRC1' : Icrc1CompletedCryptoTransaction };
export interface CryptoContent {
  'recipient' : UserId,
  'caption' : [] | [string],
  'transfer' : CryptoTransaction,
}
export type CryptoTransaction = { 'Failed' : FailedCryptoTransaction } |
  { 'Completed' : CompletedCryptoTransaction } |
  { 'Pending' : PendingCryptoTransaction };
export type Cryptocurrency = { 'InternetComputer' : null } |
  { 'CHAT' : null } |
  { 'SNS1' : null } |
  { 'KINIC' : null } |
  { 'CKBTC' : null } |
  { 'Other' : string };
export interface CustomMessageContent {
  'data' : Uint8Array | number[],
  'kind' : string,
}
export interface CustomPermission {
  'subtype' : string,
  'role' : PermissionRole,
}
export type Cycles = bigint;
export interface CyclesRegistrationFee {
  'recipient' : Principal,
  'valid_until' : TimestampMillis,
  'amount' : Cycles,
}
export interface DeletedContent {
  'timestamp' : TimestampMillis,
  'deleted_by' : UserId,
}
export interface DiamondMembershipDetails {
  'pay_in_chat' : boolean,
  'subscription' : DiamondMembershipSubscription,
  'recurring' : [] | [DiamondMembershipSubscription],
  'expires_at' : TimestampMillis,
}
export type DiamondMembershipPlanDuration = { 'OneYear' : null } |
  { 'Lifetime' : null } |
  { 'ThreeMonths' : null } |
  { 'OneMonth' : null };
export type DiamondMembershipStatus = { 'Inactive' : null } |
  { 'Lifetime' : null } |
  { 'Active' : null };
export type DiamondMembershipStatusFull = { 'Inactive' : null } |
  { 'Lifetime' : null } |
  { 'Active' : DiamondMembershipDetails };
export type DiamondMembershipSubscription = { 'OneYear' : null } |
  { 'ThreeMonths' : null } |
  { 'Disabled' : null } |
  { 'OneMonth' : null };
export type DirectChatCreated = {};
export interface DirectChatSummary {
  'read_by_them_up_to' : [] | [MessageIndex],
  'video_call_in_progress' : [] | [VideoCall],
  'date_created' : TimestampMillis,
  'metrics' : ChatMetrics,
  'them' : UserId,
  'notifications_muted' : boolean,
  'latest_message_index' : MessageIndex,
  'events_ttl' : [] | [Milliseconds],
  'last_updated' : TimestampMillis,
  'latest_event_index' : EventIndex,
  'read_by_me_up_to' : [] | [MessageIndex],
  'archived' : boolean,
  'events_ttl_last_updated' : TimestampMillis,
  'my_metrics' : ChatMetrics,
  'latest_message' : MessageEventWrapper,
}
export interface DirectChatSummaryUpdates {
  'read_by_them_up_to' : [] | [MessageIndex],
  'video_call_in_progress' : VideoCallUpdates,
  'metrics' : [] | [ChatMetrics],
  'notifications_muted' : [] | [boolean],
  'latest_message_index' : [] | [MessageIndex],
  'events_ttl' : EventsTimeToLiveUpdate,
  'last_updated' : TimestampMillis,
  'latest_event_index' : [] | [EventIndex],
  'updated_events' : Array<[number, bigint]>,
  'read_by_me_up_to' : [] | [MessageIndex],
  'chat_id' : ChatId,
  'archived' : [] | [boolean],
  'events_ttl_last_updated' : [] | [TimestampMillis],
  'my_metrics' : [] | [ChatMetrics],
  'latest_message' : [] | [MessageEventWrapper],
}
export interface DirectMessageNotification {
  'image_url' : [] | [string],
  'sender_display_name' : [] | [string],
  'sender_avatar_id' : [] | [bigint],
  'sender' : UserId,
  'sender_name' : string,
  'message_text' : [] | [string],
  'message_type' : string,
  'event_index' : EventIndex,
  'thread_root_message_index' : [] | [MessageIndex],
  'crypto_transfer' : [] | [NotificationCryptoTransferDetails],
  'message_index' : MessageIndex,
}
export interface DirectMessageTippedNotification {
  'tip' : string,
  'username' : string,
  'message_event_index' : EventIndex,
  'them' : UserId,
  'display_name' : [] | [string],
  'user_avatar_id' : [] | [bigint],
  'thread_root_message_index' : [] | [MessageIndex],
  'message_index' : MessageIndex,
}
export interface DirectReactionAddedNotification {
  'username' : string,
  'message_event_index' : EventIndex,
  'them' : UserId,
  'display_name' : [] | [string],
  'user_avatar_id' : [] | [bigint],
  'thread_root_message_index' : [] | [MessageIndex],
  'reaction' : Reaction,
  'message_index' : MessageIndex,
}
export interface Document {
  'id' : bigint,
  'data' : Uint8Array | number[],
  'mime_type' : string,
}
export type DocumentIdUpdate = { 'NoChange' : null } |
  { 'SetToNone' : null } |
  { 'SetToSome' : bigint };
export type DocumentUpdate = { 'NoChange' : null } |
  { 'SetToNone' : null } |
  { 'SetToSome' : Document };
export type Duration = bigint;
export type EmptyArgs = {};
export type EventIndex = number;
export type EventsContext = { 'Group' : [ChatId, [] | [MessageIndex]] } |
  { 'Channel' : [CommunityId, ChannelId, [] | [MessageIndex]] } |
  { 'Direct' : UserId };
export interface EventsSuccessResult {
  'expired_message_ranges' : Array<[MessageIndex, MessageIndex]>,
  'chat_last_updated' : TimestampMillis,
  'events' : Array<ChatEventWrapper>,
  'latest_event_index' : number,
  'expired_event_ranges' : Array<[EventIndex, EventIndex]>,
}
export type EventsTimeToLiveUpdate = { 'NoChange' : null } |
  { 'SetToNone' : null } |
  { 'SetToSome' : Milliseconds };
export interface EventsTimeToLiveUpdated {
  'new_ttl' : [] | [Milliseconds],
  'updated_by' : UserId,
}
export type FailedCryptoTransaction = { 'NNS' : NnsFailedCryptoTransaction } |
  { 'ICRC1' : Icrc1FailedCryptoTransaction };
export interface FieldTooLongResult {
  'length_provided' : number,
  'max_length' : number,
}
export interface FieldTooShortResult {
  'length_provided' : number,
  'min_length' : number,
}
export interface FileContent {
  'name' : string,
  'mime_type' : string,
  'file_size' : number,
  'blob_reference' : [] | [BlobReference],
  'caption' : [] | [string],
}
export type FileId = bigint;
export interface FrozenGroupInfo {
  'timestamp' : TimestampMillis,
  'frozen_by' : UserId,
  'reason' : [] | [string],
}
export type FrozenGroupUpdate = { 'NoChange' : null } |
  { 'SetToNone' : null } |
  { 'SetToSome' : FrozenGroupInfo };
export type GateCheckFailedReason = { 'NotDiamondMember' : null } |
  { 'PaymentFailed' : ICRC2_TransferFromError } |
  { 'InsufficientBalance' : bigint } |
  { 'NoSnsNeuronsFound' : null } |
  { 'NoSnsNeuronsWithRequiredDissolveDelayFound' : null } |
  { 'NoSnsNeuronsWithRequiredStakeFound' : null };
export interface GiphyContent {
  'title' : string,
  'desktop' : GiphyImageVariant,
  'caption' : [] | [string],
  'mobile' : GiphyImageVariant,
}
export interface GiphyImageVariant {
  'url' : string,
  'height' : number,
  'mime_type' : string,
  'width' : number,
}
export interface GovernanceProposalsSubtype {
  'is_nns' : boolean,
  'governance_canister_id' : CanisterId,
}
export interface GroupAndCommunitySummaryUpdatesArgs {
  'requests' : Array<SummaryUpdatesArgs>,
}
export type GroupAndCommunitySummaryUpdatesResponse = {
    'Success' : Array<SummaryUpdatesResponse>
  };
export interface GroupCanisterGroupChatSummary {
  'is_public' : boolean,
  'video_call_in_progress' : [] | [VideoCall],
  'metrics' : ChatMetrics,
  'subtype' : [] | [GroupSubtype],
  'permissions_v2' : GroupPermissions,
  'date_last_pinned' : [] | [TimestampMillis],
  'min_visible_event_index' : EventIndex,
  'gate' : [] | [AccessGate],
  'name' : string,
  'role' : GroupRole,
  'wasm_version' : BuildVersion,
  'notifications_muted' : boolean,
  'latest_message_index' : [] | [MessageIndex],
  'description' : string,
  'events_ttl' : [] | [Milliseconds],
  'last_updated' : TimestampMillis,
  'joined' : TimestampMillis,
  'avatar_id' : [] | [bigint],
  'rules_accepted' : boolean,
  'membership' : [] | [GroupMembership],
  'local_user_index_canister_id' : CanisterId,
  'latest_threads' : Array<GroupCanisterThreadDetails>,
  'frozen' : [] | [FrozenGroupInfo],
  'latest_event_index' : EventIndex,
  'history_visible_to_new_joiners' : boolean,
  'min_visible_message_index' : MessageIndex,
  'mentions' : Array<Mention>,
  'chat_id' : ChatId,
  'events_ttl_last_updated' : TimestampMillis,
  'participant_count' : number,
  'my_metrics' : ChatMetrics,
  'latest_message' : [] | [MessageEventWrapper],
}
export interface GroupCanisterGroupChatSummaryUpdates {
  'is_public' : [] | [boolean],
  'video_call_in_progress' : VideoCallUpdates,
  'metrics' : [] | [ChatMetrics],
  'subtype' : GroupSubtypeUpdate,
  'permissions_v2' : [] | [GroupPermissions],
  'date_last_pinned' : [] | [TimestampMillis],
  'gate' : AccessGateUpdate,
  'name' : [] | [string],
  'role' : [] | [GroupRole],
  'wasm_version' : [] | [BuildVersion],
  'notifications_muted' : [] | [boolean],
  'latest_message_index' : [] | [MessageIndex],
  'description' : [] | [string],
  'events_ttl' : EventsTimeToLiveUpdate,
  'last_updated' : TimestampMillis,
  'unfollowed_threads' : Uint32Array | number[],
  'avatar_id' : DocumentIdUpdate,
  'rules_accepted' : [] | [boolean],
  'membership' : [] | [GroupMembershipUpdates],
  'latest_threads' : Array<GroupCanisterThreadDetails>,
  'frozen' : FrozenGroupUpdate,
  'latest_event_index' : [] | [EventIndex],
  'updated_events' : Array<[[] | [number], number, bigint]>,
  'mentions' : Array<Mention>,
  'chat_id' : ChatId,
  'events_ttl_last_updated' : [] | [TimestampMillis],
  'participant_count' : [] | [number],
  'my_metrics' : [] | [ChatMetrics],
  'latest_message' : [] | [MessageEventWrapper],
}
export interface GroupCanisterThreadDetails {
  'root_message_index' : MessageIndex,
  'last_updated' : TimestampMillis,
  'latest_event' : EventIndex,
  'latest_message' : MessageIndex,
}
export interface GroupChatCreated {
  'name' : string,
  'description' : string,
  'created_by' : UserId,
}
export interface GroupChatSummary {
  'is_public' : boolean,
  'video_call_in_progress' : [] | [VideoCall],
  'metrics' : ChatMetrics,
  'subtype' : [] | [GroupSubtype],
  'permissions_v2' : GroupPermissions,
  'date_last_pinned' : [] | [TimestampMillis],
  'min_visible_event_index' : EventIndex,
  'gate' : [] | [AccessGate],
  'name' : string,
  'role' : GroupRole,
  'wasm_version' : BuildVersion,
  'notifications_muted' : boolean,
  'latest_message_index' : [] | [MessageIndex],
  'description' : string,
  'events_ttl' : [] | [Milliseconds],
  'last_updated' : TimestampMillis,
  'joined' : TimestampMillis,
  'avatar_id' : [] | [bigint],
  'rules_accepted' : boolean,
  'local_user_index_canister_id' : CanisterId,
  'latest_threads' : Array<ThreadSyncDetails>,
  'frozen' : [] | [FrozenGroupInfo],
  'latest_event_index' : EventIndex,
  'history_visible_to_new_joiners' : boolean,
  'read_by_me_up_to' : [] | [MessageIndex],
  'min_visible_message_index' : MessageIndex,
  'mentions' : Array<Mention>,
  'chat_id' : ChatId,
  'date_read_pinned' : [] | [TimestampMillis],
  'archived' : boolean,
  'events_ttl_last_updated' : TimestampMillis,
  'participant_count' : number,
  'my_metrics' : ChatMetrics,
  'latest_message' : [] | [MessageEventWrapper],
}
export interface GroupDescriptionChanged {
  'new_description' : string,
  'previous_description' : string,
  'changed_by' : UserId,
}
export interface GroupFrozen { 'frozen_by' : UserId, 'reason' : [] | [string] }
export interface GroupGateUpdated {
  'updated_by' : UserId,
  'new_gate' : [] | [AccessGate],
}
export type GroupInviteCodeChange = { 'Enabled' : null } |
  { 'Disabled' : null } |
  { 'Reset' : null };
export interface GroupInviteCodeChanged {
  'changed_by' : UserId,
  'change' : GroupInviteCodeChange,
}
export interface GroupMatch {
  'id' : ChatId,
  'subtype' : [] | [GroupSubtype],
  'gate' : [] | [AccessGate],
  'name' : string,
  'description' : string,
  'avatar_id' : [] | [bigint],
  'member_count' : number,
}
export interface GroupMembership {
  'role' : GroupRole,
  'notifications_muted' : boolean,
  'joined' : TimestampMillis,
  'rules_accepted' : boolean,
  'latest_threads' : Array<GroupCanisterThreadDetails>,
  'mentions' : Array<Mention>,
  'my_metrics' : ChatMetrics,
}
export interface GroupMembershipUpdates {
  'role' : [] | [GroupRole],
  'notifications_muted' : [] | [boolean],
  'unfollowed_threads' : Uint32Array | number[],
  'rules_accepted' : [] | [boolean],
  'latest_threads' : Array<GroupCanisterThreadDetails>,
  'mentions' : Array<Mention>,
  'my_metrics' : [] | [ChatMetrics],
}
export interface GroupMessageNotification {
  'image_url' : [] | [string],
  'group_avatar_id' : [] | [bigint],
  'sender_display_name' : [] | [string],
  'sender' : UserId,
  'sender_name' : string,
  'message_text' : [] | [string],
  'message_type' : string,
  'chat_id' : ChatId,
  'event_index' : EventIndex,
  'thread_root_message_index' : [] | [MessageIndex],
  'group_name' : string,
  'crypto_transfer' : [] | [NotificationCryptoTransferDetails],
  'message_index' : MessageIndex,
}
export interface GroupMessageTippedNotification {
  'tip' : string,
  'tipped_by_display_name' : [] | [string],
  'group_avatar_id' : [] | [bigint],
  'message_event_index' : EventIndex,
  'tipped_by' : UserId,
  'tipped_by_name' : string,
  'chat_id' : ChatId,
  'thread_root_message_index' : [] | [MessageIndex],
  'group_name' : string,
  'message_index' : MessageIndex,
}
export interface GroupNameChanged {
  'changed_by' : UserId,
  'new_name' : string,
  'previous_name' : string,
}
export interface GroupPermissions {
  'mention_all_members' : PermissionRole,
  'delete_messages' : PermissionRole,
  'remove_members' : PermissionRole,
  'update_group' : PermissionRole,
  'message_permissions' : MessagePermissions,
  'invite_users' : PermissionRole,
  'thread_permissions' : [] | [MessagePermissions],
  'change_roles' : PermissionRole,
  'start_video_call' : PermissionRole,
  'add_members' : PermissionRole,
  'pin_messages' : PermissionRole,
  'react_to_messages' : PermissionRole,
}
export interface GroupReactionAddedNotification {
  'added_by_name' : string,
  'group_avatar_id' : [] | [bigint],
  'message_event_index' : EventIndex,
  'added_by' : UserId,
  'added_by_display_name' : [] | [string],
  'chat_id' : ChatId,
  'thread_root_message_index' : [] | [MessageIndex],
  'group_name' : string,
  'reaction' : Reaction,
  'message_index' : MessageIndex,
}
export interface GroupReplyContext { 'event_index' : EventIndex }
export type GroupRole = { 'Participant' : null } |
  { 'Admin' : null } |
  { 'Moderator' : null } |
  { 'Owner' : null };
export interface GroupRulesChanged {
  'changed_by' : UserId,
  'enabled' : boolean,
  'prev_enabled' : boolean,
}
export type GroupSubtype = {
    'GovernanceProposals' : GovernanceProposalsSubtype
  };
export type GroupSubtypeUpdate = { 'NoChange' : null } |
  { 'SetToNone' : null } |
  { 'SetToSome' : GroupSubtype };
export interface GroupUnfrozen { 'unfrozen_by' : UserId }
export interface GroupVisibilityChanged {
  'changed_by' : UserId,
  'now_public' : boolean,
}
export type Hash = Uint8Array | number[];
export type ICP = Tokens;
export interface ICPRegistrationFee {
  'recipient' : AccountIdentifier,
  'valid_until' : TimestampMillis,
  'amount' : ICP,
}
export interface ICRC1_TransferArgs {
  'to' : Account,
  'fee' : [] | [bigint],
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Subaccount],
  'created_at_time' : [] | [Timestamp],
  'amount' : bigint,
}
export type ICRC1_TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export interface ICRC2_ApproveArgs {
  'fee' : [] | [bigint],
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
  'expected_allowance' : [] | [bigint],
  'expires_at' : [] | [bigint],
  'spender' : Account,
}
export type ICRC2_ApproveError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'AllowanceChanged' : { 'current_allowance' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : null } |
  { 'Expired' : { 'ledger_time' : bigint } } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export interface ICRC2_TransferFromArgs {
  'to' : Account,
  'fee' : [] | [bigint],
  'spender_subaccount' : [] | [Uint8Array | number[]],
  'from' : Account,
  'memo' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
}
export type ICRC2_TransferFromError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'InsufficientAllowance' : { 'allowance' : bigint } } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export interface Icrc1Account {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export type Icrc1AccountOrMint = { 'Mint' : null } |
  { 'Account' : Icrc1Account };
export interface Icrc1CompletedCryptoTransaction {
  'to' : Icrc1AccountOrMint,
  'fee' : bigint,
  'created' : TimestampNanos,
  'token' : Cryptocurrency,
  'block_index' : BlockIndex,
  'from' : Icrc1AccountOrMint,
  'memo' : [] | [Memo],
  'ledger' : CanisterId,
  'amount' : bigint,
}
export interface Icrc1FailedCryptoTransaction {
  'to' : Icrc1AccountOrMint,
  'fee' : bigint,
  'created' : TimestampNanos,
  'token' : Cryptocurrency,
  'from' : Icrc1AccountOrMint,
  'memo' : [] | [Memo],
  'error_message' : string,
  'ledger' : CanisterId,
  'amount' : bigint,
}
export interface Icrc1PendingCryptoTransaction {
  'to' : Icrc1Account,
  'fee' : bigint,
  'created' : TimestampNanos,
  'token' : Cryptocurrency,
  'memo' : [] | [Memo],
  'ledger' : CanisterId,
  'amount' : bigint,
}
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
export type InvalidPollReason = { 'DuplicateOptions' : null } |
  { 'TooFewOptions' : number } |
  { 'TooManyOptions' : number } |
  { 'OptionTooLong' : number } |
  { 'EndDateInThePast' : null } |
  { 'PollsNotValidForDirectChats' : null };
export interface InviteUsersToChannelArgs {
  'channel_id' : ChannelId,
  'community_id' : CommunityId,
  'user_ids' : Array<UserId>,
  'caller_username' : string,
}
export interface InviteUsersToChannelFailed { 'failed_users' : Array<UserId> }
export interface InviteUsersToChannelPartialSuccess {
  'failed_users' : Array<UserId>,
}
export type InviteUsersToChannelResponse = {
    'Failed' : InviteUsersToChannelFailed
  } |
  { 'UserNotInChannel' : null } |
  { 'PartialSuccess' : InviteUsersToChannelPartialSuccess } |
  { 'ChannelNotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'Success' : null } |
  { 'UserNotInCommunity' : null } |
  { 'UserSuspended' : null } |
  { 'CommunityFrozen' : null } |
  { 'InternalError' : string } |
  { 'TooManyInvites' : number };
export interface InviteUsersToCommunityArgs {
  'community_id' : CommunityId,
  'user_ids' : Array<UserId>,
  'caller_username' : string,
}
export type InviteUsersToCommunityResponse = { 'NotAuthorized' : null } |
  { 'Success' : null } |
  { 'UserNotInCommunity' : null } |
  { 'UserSuspended' : null } |
  { 'CommunityFrozen' : null } |
  { 'InternalError' : string } |
  { 'TooManyInvites' : number };
export interface InviteUsersToGroupArgs {
  'user_ids' : Array<UserId>,
  'caller_username' : string,
  'group_id' : ChatId,
  'correlation_id' : bigint,
}
export type InviteUsersToGroupResponse = { 'GroupNotFound' : null } |
  { 'CallerNotInGroup' : null } |
  { 'ChatFrozen' : null } |
  { 'NotAuthorized' : null } |
  { 'Success' : null } |
  { 'InternalError' : string } |
  { 'TooManyInvites' : number };
export interface JoinChannelArgs {
  'channel_id' : ChannelId,
  'community_id' : CommunityId,
  'invite_code' : [] | [bigint],
}
export type JoinChannelResponse = { 'NotInvited' : null } |
  { 'AlreadyInChannel' : CommunityCanisterChannelSummary } |
  { 'SuccessJoinedCommunity' : CommunityCanisterCommunitySummary } |
  { 'CommunityNotFound' : null } |
  { 'GateCheckFailed' : GateCheckFailedReason } |
  { 'MemberLimitReached' : number } |
  { 'ChannelNotFound' : null } |
  { 'Success' : CommunityCanisterChannelSummary } |
  { 'CommunityNotPublic' : null } |
  { 'UserSuspended' : null } |
  { 'CommunityFrozen' : null } |
  { 'InternalError' : string } |
  { 'UserBlocked' : null };
export interface JoinCommunityArgs {
  'community_id' : CommunityId,
  'invite_code' : [] | [bigint],
}
export type JoinCommunityResponse = { 'NotInvited' : null } |
  { 'CommunityNotFound' : null } |
  { 'GateCheckFailed' : GateCheckFailedReason } |
  { 'MemberLimitReached' : number } |
  { 'Success' : CommunityCanisterCommunitySummary } |
  { 'CommunityNotPublic' : null } |
  { 'UserSuspended' : null } |
  { 'CommunityFrozen' : null } |
  { 'AlreadyInCommunity' : CommunityCanisterCommunitySummary } |
  { 'InternalError' : string } |
  { 'UserBlocked' : null };
export interface JoinGroupArgs {
  'invite_code' : [] | [bigint],
  'correlation_id' : bigint,
  'chat_id' : ChatId,
}
export type JoinGroupResponse = { 'NotInvited' : null } |
  { 'Blocked' : null } |
  { 'GroupNotFound' : null } |
  { 'GroupNotPublic' : null } |
  { 'AlreadyInGroup' : null } |
  { 'GateCheckFailed' : GateCheckFailedReason } |
  { 'ChatFrozen' : null } |
  { 'Success' : GroupCanisterGroupChatSummary } |
  { 'UserSuspended' : null } |
  { 'ParticipantLimitReached' : number } |
  { 'AlreadyInGroupV2' : GroupCanisterGroupChatSummary } |
  { 'InternalError' : string };
export interface MembersAddedToDefaultChannel { 'count' : number }
export type Memo = Uint8Array | number[];
export interface Mention {
  'message_id' : MessageId,
  'event_index' : EventIndex,
  'thread_root_message_index' : [] | [MessageIndex],
  'mentioned_by' : UserId,
  'message_index' : MessageIndex,
}
export interface Message {
  'forwarded' : boolean,
  'content' : MessageContent,
  'edited' : boolean,
  'block_level_markdown' : boolean,
  'tips' : Array<[CanisterId, Array<[UserId, bigint]>]>,
  'sender' : UserId,
  'thread_summary' : [] | [ThreadSummary],
  'message_id' : MessageId,
  'replies_to' : [] | [ReplyContext],
  'reactions' : Array<[string, Array<UserId>]>,
  'message_index' : MessageIndex,
}
export type MessageContent = { 'VideoCall' : VideoCallContent } |
  { 'ReportedMessage' : ReportedMessage } |
  { 'Giphy' : GiphyContent } |
  { 'File' : FileContent } |
  { 'Poll' : PollContent } |
  { 'Text' : TextContent } |
  { 'P2PSwap' : P2PSwapContent } |
  { 'Image' : ImageContent } |
  { 'Prize' : PrizeContent } |
  { 'Custom' : CustomMessageContent } |
  { 'GovernanceProposal' : ProposalContent } |
  { 'PrizeWinner' : PrizeWinnerContent } |
  { 'Audio' : AudioContent } |
  { 'Crypto' : CryptoContent } |
  { 'Video' : VideoContent } |
  { 'Deleted' : DeletedContent } |
  { 'MessageReminderCreated' : MessageReminderCreated } |
  { 'MessageReminder' : MessageReminder };
export type MessageContentInitial = { 'Giphy' : GiphyContent } |
  { 'File' : FileContent } |
  { 'Poll' : PollContent } |
  { 'Text' : TextContent } |
  { 'P2PSwap' : P2PSwapContentInitial } |
  { 'Image' : ImageContent } |
  { 'Prize' : PrizeContentInitial } |
  { 'Custom' : CustomMessageContent } |
  { 'GovernanceProposal' : ProposalContent } |
  { 'Audio' : AudioContent } |
  { 'Crypto' : CryptoContent } |
  { 'Video' : VideoContent } |
  { 'Deleted' : DeletedContent } |
  { 'MessageReminderCreated' : MessageReminderCreated } |
  { 'MessageReminder' : MessageReminder };
export interface MessageEventWrapper {
  'event' : Message,
  'timestamp' : TimestampMillis,
  'index' : EventIndex,
  'correlation_id' : bigint,
  'expires_at' : [] | [TimestampMillis],
}
export type MessageId = bigint;
export type MessageIndex = number;
export interface MessageIndexRange {
  'end' : MessageIndex,
  'start' : MessageIndex,
}
export interface MessageMatch {
  'content' : MessageContent,
  'sender' : UserId,
  'score' : number,
  'message_index' : MessageIndex,
}
export interface MessagePermissions {
  'audio' : [] | [PermissionRole],
  'video' : [] | [PermissionRole],
  'video_call' : [] | [PermissionRole],
  'custom' : Array<CustomPermission>,
  'file' : [] | [PermissionRole],
  'poll' : [] | [PermissionRole],
  'text' : [] | [PermissionRole],
  'crypto' : [] | [PermissionRole],
  'giphy' : [] | [PermissionRole],
  'default' : PermissionRole,
  'image' : [] | [PermissionRole],
  'prize' : [] | [PermissionRole],
  'p2p_swap' : [] | [PermissionRole],
}
export interface MessagePinned {
  'pinned_by' : UserId,
  'message_index' : MessageIndex,
}
export interface MessageReminder {
  'notes' : [] | [string],
  'reminder_id' : bigint,
}
export interface MessageReminderCreated {
  'hidden' : boolean,
  'notes' : [] | [string],
  'remind_at' : TimestampMillis,
  'reminder_id' : bigint,
}
export interface MessageReport {
  'notes' : [] | [string],
  'timestamp' : TimestampMillis,
  'reported_by' : UserId,
  'reason_code' : number,
}
export interface MessageUnpinned {
  'due_to_message_deleted' : boolean,
  'unpinned_by' : UserId,
  'message_index' : MessageIndex,
}
export interface MessagesSuccessResult {
  'messages' : Array<MessageEventWrapper>,
  'chat_last_updated' : TimestampMillis,
  'latest_event_index' : EventIndex,
}
export type Milliseconds = bigint;
export type MultiUserChat = { 'Group' : ChatId } |
  { 'Channel' : [CommunityId, ChannelId] };
export interface NnsCompletedCryptoTransaction {
  'to' : NnsCryptoAccount,
  'fee' : Tokens,
  'created' : TimestampNanos,
  'token' : Cryptocurrency,
  'transaction_hash' : TransactionHash,
  'block_index' : BlockIndex,
  'from' : NnsCryptoAccount,
  'memo' : bigint,
  'ledger' : CanisterId,
  'amount' : Tokens,
}
export type NnsCryptoAccount = { 'Mint' : null } |
  { 'Account' : AccountIdentifier };
export interface NnsFailedCryptoTransaction {
  'to' : NnsCryptoAccount,
  'fee' : Tokens,
  'created' : TimestampNanos,
  'token' : Cryptocurrency,
  'transaction_hash' : TransactionHash,
  'from' : NnsCryptoAccount,
  'memo' : bigint,
  'error_message' : string,
  'ledger' : CanisterId,
  'amount' : Tokens,
}
export type NnsNeuronId = bigint;
export interface NnsPendingCryptoTransaction {
  'to' : NnsUserOrAccount,
  'fee' : [] | [Tokens],
  'created' : TimestampNanos,
  'token' : Cryptocurrency,
  'memo' : [] | [bigint],
  'ledger' : CanisterId,
  'amount' : Tokens,
}
export interface NnsProposal {
  'id' : ProposalId,
  'url' : string,
  'status' : ProposalDecisionStatus,
  'payload_text_rendering' : [] | [string],
  'tally' : Tally,
  'title' : string,
  'created' : TimestampMillis,
  'topic' : number,
  'last_updated' : TimestampMillis,
  'deadline' : TimestampMillis,
  'reward_status' : ProposalRewardStatus,
  'summary' : string,
  'proposer' : NnsNeuronId,
}
export type NnsUserOrAccount = { 'User' : UserId } |
  { 'Account' : AccountIdentifier };
export type Notification = {
    'GroupReactionAdded' : GroupReactionAddedNotification
  } |
  { 'ChannelMessageTipped' : ChannelMessageTippedNotification } |
  { 'DirectMessageTipped' : DirectMessageTippedNotification } |
  { 'DirectMessage' : DirectMessageNotification } |
  { 'ChannelReactionAdded' : ChannelReactionAddedNotification } |
  { 'DirectReactionAdded' : DirectReactionAddedNotification } |
  { 'GroupMessage' : GroupMessageNotification } |
  { 'GroupMessageTipped' : GroupMessageTippedNotification } |
  { 'AddedToChannel' : AddedToChannelNotification } |
  { 'ChannelMessage' : ChannelMessageNotification };
export interface NotificationCryptoTransferDetails {
  'recipient' : UserId,
  'ledger' : CanisterId,
  'recipient_username' : [] | [string],
  'amount' : bigint,
  'symbol' : string,
}
export interface NotificationEnvelope {
  'notification_bytes' : Uint8Array | number[],
  'recipients' : Array<UserId>,
  'timestamp' : TimestampMillis,
}
export interface OptionalCommunityPermissions {
  'create_public_channel' : [] | [CommunityPermissionRole],
  'manage_user_groups' : [] | [CommunityPermissionRole],
  'update_details' : [] | [CommunityPermissionRole],
  'remove_members' : [] | [CommunityPermissionRole],
  'invite_users' : [] | [CommunityPermissionRole],
  'change_roles' : [] | [CommunityPermissionRole],
  'create_private_channel' : [] | [CommunityPermissionRole],
}
export interface OptionalGroupPermissions {
  'mention_all_members' : [] | [PermissionRole],
  'delete_messages' : [] | [PermissionRole],
  'remove_members' : [] | [PermissionRole],
  'update_group' : [] | [PermissionRole],
  'message_permissions' : [] | [OptionalMessagePermissions],
  'invite_users' : [] | [PermissionRole],
  'thread_permissions' : OptionalMessagePermissionsUpdate,
  'change_roles' : [] | [PermissionRole],
  'start_video_call' : [] | [PermissionRole],
  'pin_messages' : [] | [PermissionRole],
  'react_to_messages' : [] | [PermissionRole],
}
export interface OptionalMessagePermissions {
  'custom_updated' : Array<CustomPermission>,
  'audio' : PermissionRoleUpdate,
  'video' : PermissionRoleUpdate,
  'video_call' : PermissionRoleUpdate,
  'file' : PermissionRoleUpdate,
  'poll' : PermissionRoleUpdate,
  'text' : PermissionRoleUpdate,
  'crypto' : PermissionRoleUpdate,
  'giphy' : PermissionRoleUpdate,
  'custom_deleted' : Array<string>,
  'default' : [] | [PermissionRole],
  'image' : PermissionRoleUpdate,
  'prize' : PermissionRoleUpdate,
  'p2p_swap' : PermissionRoleUpdate,
}
export type OptionalMessagePermissionsUpdate = { 'NoChange' : null } |
  { 'SetToNone' : null } |
  { 'SetToSome' : OptionalMessagePermissions };
export interface P2PSwapAccepted {
  'accepted_by' : UserId,
  'token1_txn_in' : bigint,
}
export interface P2PSwapCancelled { 'token0_txn_out' : [] | [bigint] }
export interface P2PSwapCompleted {
  'accepted_by' : UserId,
  'token1_txn_out' : bigint,
  'token0_txn_out' : bigint,
  'token1_txn_in' : bigint,
}
export interface P2PSwapContent {
  'status' : P2PSwapStatus,
  'token0_txn_in' : bigint,
  'swap_id' : number,
  'token0_amount' : bigint,
  'token0' : TokenInfo,
  'token1' : TokenInfo,
  'caption' : [] | [string],
  'token1_amount' : bigint,
  'expires_at' : TimestampMillis,
}
export interface P2PSwapContentInitial {
  'token0_amount' : bigint,
  'token0' : TokenInfo,
  'token1' : TokenInfo,
  'caption' : [] | [string],
  'token1_amount' : bigint,
  'expires_in' : Milliseconds,
}
export type P2PSwapExpired = P2PSwapCancelled;
export interface P2PSwapReserved { 'reserved_by' : UserId }
export type P2PSwapStatus = { 'Reserved' : P2PSwapReserved } |
  { 'Open' : null } |
  { 'Accepted' : P2PSwapAccepted } |
  { 'Cancelled' : P2PSwapCancelled } |
  { 'Completed' : P2PSwapCompleted } |
  { 'Expired' : P2PSwapExpired };
export interface Participant {
  'role' : GroupRole,
  'user_id' : UserId,
  'date_added' : TimestampMillis,
}
export interface ParticipantJoined {
  'user_id' : UserId,
  'invited_by' : [] | [UserId],
}
export interface ParticipantLeft { 'user_id' : UserId }
export interface ParticipantsAdded {
  'user_ids' : Array<UserId>,
  'unblocked' : Array<UserId>,
  'added_by' : UserId,
}
export interface ParticipantsRemoved {
  'user_ids' : Array<UserId>,
  'removed_by' : UserId,
}
export interface PaymentGate {
  'fee' : bigint,
  'ledger_canister_id' : CanisterId,
  'amount' : bigint,
}
export type PendingCryptoTransaction = { 'NNS' : NnsPendingCryptoTransaction } |
  { 'ICRC1' : Icrc1PendingCryptoTransaction };
export type PermissionRole = { 'None' : null } |
  { 'Moderators' : null } |
  { 'Owner' : null } |
  { 'Admins' : null } |
  { 'Members' : null };
export type PermissionRoleUpdate = { 'NoChange' : null } |
  { 'SetToNone' : null } |
  { 'SetToSome' : PermissionRole };
export interface PermissionsChanged {
  'changed_by' : UserId,
  'old_permissions_v2' : GroupPermissions,
  'new_permissions_v2' : GroupPermissions,
}
export type PinnedMessageUpdate = { 'NoChange' : null } |
  { 'SetToNone' : null } |
  { 'SetToSome' : MessageIndex };
export interface PollConfig {
  'allow_multiple_votes_per_user' : boolean,
  'text' : [] | [string],
  'show_votes_before_end_date' : boolean,
  'end_date' : [] | [TimestampMillis],
  'anonymous' : boolean,
  'allow_user_to_change_vote' : boolean,
  'options' : Array<string>,
}
export interface PollContent {
  'votes' : PollVotes,
  'ended' : boolean,
  'config' : PollConfig,
}
export interface PollVotes {
  'total' : TotalPollVotes,
  'user' : Uint32Array | number[],
}
export interface PrizeContent {
  'token' : Cryptocurrency,
  'end_date' : TimestampMillis,
  'prizes_remaining' : number,
  'prizes_pending' : number,
  'caption' : [] | [string],
  'diamond_only' : boolean,
  'winners' : Array<UserId>,
}
export interface PrizeContentInitial {
  'end_date' : TimestampMillis,
  'caption' : [] | [string],
  'prizes' : Array<Tokens>,
  'transfer' : CryptoTransaction,
  'diamond_only' : boolean,
}
export interface PrizeWinnerContent {
  'transaction' : CompletedCryptoTransaction,
  'winner' : UserId,
  'prize_message' : MessageIndex,
}
export type Proposal = { 'NNS' : NnsProposal } |
  { 'SNS' : SnsProposal };
export interface ProposalContent {
  'my_vote' : [] | [boolean],
  'governance_canister_id' : CanisterId,
  'proposal' : Proposal,
}
export type ProposalDecisionStatus = { 'Failed' : null } |
  { 'Open' : null } |
  { 'Rejected' : null } |
  { 'Executed' : null } |
  { 'Adopted' : null } |
  { 'Unspecified' : null };
export type ProposalId = bigint;
export type ProposalRewardStatus = { 'ReadyToSettle' : null } |
  { 'AcceptVotes' : null } |
  { 'Unspecified' : null } |
  { 'Settled' : null };
export interface PublicGroupSummary {
  'is_public' : boolean,
  'subtype' : [] | [GroupSubtype],
  'gate' : [] | [AccessGate],
  'name' : string,
  'wasm_version' : BuildVersion,
  'latest_message_index' : [] | [MessageIndex],
  'description' : string,
  'events_ttl' : [] | [Milliseconds],
  'last_updated' : TimestampMillis,
  'avatar_id' : [] | [bigint],
  'local_user_index_canister_id' : CanisterId,
  'frozen' : [] | [FrozenGroupInfo],
  'latest_event_index' : EventIndex,
  'history_visible_to_new_joiners' : boolean,
  'chat_id' : ChatId,
  'events_ttl_last_updated' : TimestampMillis,
  'participant_count' : number,
  'latest_message' : [] | [MessageEventWrapper],
}
export interface PushEventResult {
  'timestamp' : TimestampMillis,
  'index' : EventIndex,
  'expires_at' : [] | [TimestampMillis],
}
export type Reaction = string;
export interface RegisterUserArgs {
  'username' : string,
  'public_key' : Uint8Array | number[],
  'referral_code' : [] | [string],
}
export type RegisterUserResponse = { 'RegistrationInProgress' : null } |
  { 'UsernameTooShort' : number } |
  { 'UsernameInvalid' : null } |
  { 'AlreadyRegistered' : null } |
  { 'UserLimitReached' : null } |
  { 'UsernameTooLong' : number } |
  { 'Success' : { 'icp_account' : AccountIdentifier, 'user_id' : UserId } } |
  { 'PublicKeyInvalid' : string } |
  { 'ReferralCodeAlreadyClaimed' : null } |
  { 'ReferralCodeExpired' : null } |
  { 'InternalError' : string } |
  { 'ReferralCodeInvalid' : null } |
  { 'CyclesBalanceTooLow' : null };
export type RegistrationFee = { 'ICP' : ICPRegistrationFee } |
  { 'Cycles' : CyclesRegistrationFee };
export interface ReplyContext {
  'chat_if_other' : [] | [[Chat, [] | [MessageIndex]]],
  'event_index' : EventIndex,
}
export type ReportMessageResponse = { 'Success' : null } |
  { 'InternalError' : string };
export interface ReportMessageV2Args {
  'notes' : [] | [string],
  'chat_id' : MultiUserChat,
  'reason_code' : number,
  'event_index' : EventIndex,
  'thread_root_message_index' : [] | [MessageIndex],
}
export interface ReportedMessage {
  'count' : number,
  'reports' : Array<MessageReport>,
}
export type ReserveP2PSwapResult = { 'Success' : ReserveP2PSwapSuccess } |
  { 'SwapNotFound' : null } |
  { 'Failure' : P2PSwapStatus };
export interface ReserveP2PSwapSuccess {
  'created' : TimestampMillis,
  'content' : P2PSwapContent,
  'created_by' : UserId,
}
export interface RoleChanged {
  'user_ids' : Array<UserId>,
  'changed_by' : UserId,
  'old_role' : GroupRole,
  'new_role' : GroupRole,
}
export interface Rules { 'text' : string, 'enabled' : boolean }
export interface SelectedGroupUpdates {
  'blocked_users_removed' : Array<UserId>,
  'pinned_messages_removed' : Uint32Array | number[],
  'invited_users' : [] | [Array<UserId>],
  'last_updated' : TimestampMillis,
  'members_added_or_updated' : Array<Participant>,
  'pinned_messages_added' : Uint32Array | number[],
  'chat_rules' : [] | [VersionedRules],
  'members_removed' : Array<UserId>,
  'timestamp' : TimestampMillis,
  'latest_event_index' : EventIndex,
  'blocked_users_added' : Array<UserId>,
}
export interface SnsNeuronGate {
  'min_stake_e8s' : [] | [bigint],
  'min_dissolve_delay' : [] | [Milliseconds],
  'governance_canister_id' : CanisterId,
}
export type SnsNeuronId = Uint8Array | number[];
export interface SnsProposal {
  'id' : ProposalId,
  'url' : string,
  'status' : ProposalDecisionStatus,
  'payload_text_rendering' : [] | [string],
  'tally' : Tally,
  'title' : string,
  'created' : TimestampMillis,
  'action' : bigint,
  'minimum_yes_proportion_of_total' : number,
  'last_updated' : TimestampMillis,
  'deadline' : TimestampMillis,
  'reward_status' : ProposalRewardStatus,
  'summary' : string,
  'proposer' : SnsNeuronId,
  'minimum_yes_proportion_of_exercised' : number,
}
export type Subaccount = Uint8Array | number[];
export interface Subscription {
  'value' : SubscriptionInfo,
  'last_active' : TimestampMillis,
}
export interface SubscriptionInfo {
  'endpoint' : string,
  'keys' : SubscriptionKeys,
}
export interface SubscriptionKeys { 'auth' : string, 'p256dh' : string }
export interface SummaryUpdatesArgs {
  'updates_since' : [] | [TimestampMillis],
  'canister_id' : CanisterId,
  'invite_code' : [] | [bigint],
  'is_community' : boolean,
}
export type SummaryUpdatesResponse = {
    'SuccessCommunity' : CommunityCanisterCommunitySummary
  } |
  { 'SuccessGroupUpdates' : GroupCanisterGroupChatSummaryUpdates } |
  { 'SuccessCommunityUpdates' : CommunityCanisterCommunitySummaryUpdates } |
  { 'NotFound' : null } |
  { 'SuccessGroup' : GroupCanisterGroupChatSummary } |
  { 'SuccessNoUpdates' : null } |
  { 'InternalError' : string };
export type SwapStatusError = { 'Reserved' : SwapStatusErrorReserved } |
  { 'Accepted' : SwapStatusErrorAccepted } |
  { 'Cancelled' : SwapStatusErrorCancelled } |
  { 'Completed' : SwapStatusErrorCompleted } |
  { 'Expired' : SwapStatusErrorExpired };
export interface SwapStatusErrorAccepted {
  'accepted_by' : UserId,
  'token1_txn_in' : bigint,
}
export interface SwapStatusErrorCancelled { 'token0_txn_out' : [] | [bigint] }
export interface SwapStatusErrorCompleted {
  'accepted_by' : UserId,
  'token1_txn_out' : bigint,
  'token0_txn_out' : bigint,
  'token1_txn_in' : bigint,
}
export interface SwapStatusErrorExpired { 'token0_txn_out' : [] | [bigint] }
export interface SwapStatusErrorReserved { 'reserved_by' : UserId }
export interface Tally {
  'no' : bigint,
  'yes' : bigint,
  'total' : bigint,
  'timestamp' : TimestampMillis,
}
export interface TextContent { 'text' : string }
export type TextUpdate = { 'NoChange' : null } |
  { 'SetToNone' : null } |
  { 'SetToSome' : string };
export interface ThreadPreview {
  'latest_replies' : Array<MessageEventWrapper>,
  'total_replies' : number,
  'root_message' : MessageEventWrapper,
}
export interface ThreadSummary {
  'latest_event_timestamp' : TimestampMillis,
  'participant_ids' : Array<UserId>,
  'reply_count' : number,
  'latest_event_index' : EventIndex,
  'followed_by_me' : boolean,
}
export interface ThreadSyncDetails {
  'root_message_index' : MessageIndex,
  'last_updated' : TimestampMillis,
  'read_up_to' : [] | [MessageIndex],
  'latest_event' : [] | [EventIndex],
  'latest_message' : [] | [MessageIndex],
}
export type Timestamp = bigint;
export type TimestampMillis = bigint;
export type TimestampNanos = bigint;
export type TimestampUpdate = { 'NoChange' : null } |
  { 'SetToNone' : null } |
  { 'SetToSome' : TimestampMillis };
export interface TokenBalanceGate {
  'min_balance' : bigint,
  'ledger_canister_id' : CanisterId,
}
export interface TokenInfo {
  'fee' : bigint,
  'decimals' : number,
  'token' : Cryptocurrency,
  'ledger' : CanisterId,
}
export interface Tokens { 'e8s' : bigint }
export type TotalPollVotes = { 'Anonymous' : Array<[number, number]> } |
  { 'Visible' : Array<[number, Array<UserId>]> } |
  { 'Hidden' : number };
export type TransactionHash = Uint8Array | number[];
export interface UpdatedRules {
  'new_version' : boolean,
  'text' : string,
  'enabled' : boolean,
}
export interface User { 'username' : string, 'user_id' : UserId }
export interface UserGroup {
  'members' : number,
  'name' : string,
  'user_group_id' : number,
}
export type UserId = CanisterId;
export interface UserSummary {
  'username' : string,
  'diamond_member' : boolean,
  'diamond_membership_status' : DiamondMembershipStatus,
  'user_id' : UserId,
  'is_bot' : boolean,
  'display_name' : [] | [string],
  'avatar_id' : [] | [bigint],
  'suspended' : boolean,
}
export interface UsersBlocked {
  'user_ids' : Array<UserId>,
  'blocked_by' : UserId,
}
export interface UsersInvited {
  'user_ids' : Array<UserId>,
  'invited_by' : UserId,
}
export interface UsersUnblocked {
  'user_ids' : Array<UserId>,
  'unblocked_by' : UserId,
}
export type Value = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string };
export interface VerifiedCredentialGate {
  'credential_arguments' : [] | [Uint8Array | number[]],
  'issuer_origin' : string,
  'credential_type' : string,
}
export type Version = number;
export interface VersionedRules {
  'text' : string,
  'version' : Version,
  'enabled' : boolean,
}
export interface VideoCall {
  'call_type' : VideoCallType,
  'message_index' : MessageIndex,
}
export interface VideoCallContent {
  'participants' : Array<CallParticipant>,
  'ended' : [] | [TimestampMillis],
  'hidden_participants' : number,
  'call_type' : VideoCallType,
}
export interface VideoCallContentInitial { 'initiator' : UserId }
export interface VideoCallParticipants {
  'participants' : Array<CallParticipant>,
  'hidden' : Array<CallParticipant>,
  'last_updated' : TimestampMillis,
}
export type VideoCallType = { 'Default' : null } |
  { 'Broadcast' : null };
export type VideoCallUpdates = { 'NoChange' : null } |
  { 'SetToNone' : null } |
  { 'SetToSome' : VideoCall };
export interface VideoContent {
  'height' : number,
  'image_blob_reference' : [] | [BlobReference],
  'video_blob_reference' : [] | [BlobReference],
  'mime_type' : string,
  'thumbnail_data' : string,
  'caption' : [] | [string],
  'width' : number,
}
export type VoteOperation = { 'RegisterVote' : null } |
  { 'DeleteVote' : null };
export interface _SERVICE {
  'access_token' : ActorMethod<[AccessTokenArgs], AccessTokenResponse>,
  'chat_events' : ActorMethod<[ChatEventsArgs], ChatEventsResponse>,
  'group_and_community_summary_updates' : ActorMethod<
    [GroupAndCommunitySummaryUpdatesArgs],
    GroupAndCommunitySummaryUpdatesResponse
  >,
  'invite_users_to_channel' : ActorMethod<
    [InviteUsersToChannelArgs],
    InviteUsersToChannelResponse
  >,
  'invite_users_to_community' : ActorMethod<
    [InviteUsersToCommunityArgs],
    InviteUsersToCommunityResponse
  >,
  'invite_users_to_group' : ActorMethod<
    [InviteUsersToGroupArgs],
    InviteUsersToGroupResponse
  >,
  'join_channel' : ActorMethod<[JoinChannelArgs], JoinChannelResponse>,
  'join_community' : ActorMethod<[JoinCommunityArgs], JoinCommunityResponse>,
  'join_group' : ActorMethod<[JoinGroupArgs], JoinGroupResponse>,
  'register_user' : ActorMethod<[RegisterUserArgs], RegisterUserResponse>,
  'report_message_v2' : ActorMethod<
    [ReportMessageV2Args],
    ReportMessageResponse
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
