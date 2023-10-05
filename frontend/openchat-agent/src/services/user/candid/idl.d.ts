import type { IDL } from "@dfinity/candid";
import {
    _SERVICE,
    ReplyContext,
    DirectChatSummaryUpdates,
    ChatEventWrapper,
    CreateGroupResponse,
    DeleteGroupResponse,
    InitialStateResponse,
    UpdatesResponse,
    ChatSummary,
    GroupChatSummary,
    DirectChatSummary,
    UserCanisterGroupChatSummary,
    UserCanisterGroupChatSummaryUpdates,
    Message,
    ChatEvent,
    UserId,
    MessageContent,
    MessageContentInitial,
    FileContent,
    TextContent,
    ImageContent,
    VideoContent,
    AudioContent,
    GiphyContent,
    GiphyImageVariant,
    ProposalContent,
    PrizeContent,
    PrizeWinnerContent,
    PrizeContentInitial,
    MessageReminderCreated,
    MessageReminder,
    Proposal,
    PollContent,
    PollVotes,
    PollConfig,
    TotalPollVotes,
    CryptoContent,
    CryptoTransaction,
    CompletedCryptoTransaction,
    FailedCryptoTransaction,
    PendingCryptoTransaction,
    NnsPendingCryptoTransaction,
    NnsCompletedCryptoTransaction,
    NnsFailedCryptoTransaction,
    Icrc1CompletedCryptoTransaction,
    Icrc1FailedCryptoTransaction,
    Icrc1PendingCryptoTransaction,
    DeletedContent,
    TimestampMillis,
    BlobReference,
    Participant,
    EventIndex,
    EventsByIndexArgs,
    EventsResponse,
    EventsSuccessResult,
    EventsArgs,
    SendMessageV2Args,
    SendMessageResponse,
    EditMessageResponse,
    BlockUserResponse,
    UnblockUserResponse,
    LeaveGroupResponse,
    MarkReadResponse,
    SetAvatarResponse,
    AddReactionResponse,
    RemoveReactionResponse,
    DeleteMessagesResponse,
    UndeleteMessagesResponse,
    UpdatedMessage,
    SearchMessagesResponse,
    MessageMatch,
    MuteNotificationsResponse,
    UnmuteNotificationsResponse,
    GroupRole,
    Mention,
    User,
    ICP,
    SetBioResponse,
    GroupPermissions,
    PermissionRole,
    WithdrawCryptoResponse,
    SendMessageWithTransferToGroupArgs,
    SendMessageWithTransferToGroupResponse,
    SendMessageWithTransferToChannelArgs,
    SendMessageWithTransferToChannelResponse,
    ChatMetrics,
    Cryptocurrency,
    PublicProfileResponse,
    ThreadSummary,
    PinChatV2Response,
    UnpinChatV2Response,
    PinChatResponse,
    UnpinChatResponse,
    ProposalDecisionStatus,
    ProposalRewardStatus,
    ThreadSyncDetails,
    MigrateUserPrincipalResponse,
    GroupSubtype,
    GovernanceProposalsSubtype,
    GroupSubtypeUpdate,
    ArchiveChatResponse,
    Icrc1Account,
    DeletedMessageResponse,
    AccessGate,
    SetMessageReminderResponse,
    CustomMessageContent,
    ReportedMessage,
    MessageReport,
    CreateCommunityResponse,
    CommunityPermissions,
    CommunitiesInitial,
    FavouriteChatsInitial,
    GroupChatsInitial,
    DirectChatsInitial,
    CachedGroupChatSummaries,
    UserCanisterCommunitySummary,
    UserCanisterChannelSummary,
    Chat,
    CommunitiesUpdates,
    FavouriteChatsUpdates,
    GroupChatsUpdates,
    DirectChatsUpdates,
    UserCanisterCommunitySummaryUpdates,
    UserCanisterChannelSummaryUpdates,
    MarkReadArgs,
    CommunityMessagesRead,
    ChatMessagesRead,
    ChannelMessagesRead,
    MultiUserChat,
    ChatInList,
    ManageFavouriteChatsResponse,
    LeaveCommunityResponse,
    DeleteCommunityResponse,
    ArchiveUnarchiveChatsResponse,
    SetCommunityIndexesResponse,
    TipMessageResponse,
    SubmitProposalResponse
} from "./types";
export {
    _SERVICE as UserService,
    SendMessageV2Args as ApiSendMessageArgs,
    SendMessageResponse as ApiSendMessageResponse,
    EditMessageResponse as ApiEditMessageResponse,
    Message as ApiMessage,
    ReplyContext as ApiReplyContext,
    DirectChatSummaryUpdates as ApiDirectChatSummaryUpdates,
    CreateGroupResponse as ApiCreateGroupResponse,
    DeleteGroupResponse as ApiDeleteGroupResponse,
    InitialStateResponse as ApiInitialStateResponse,
    UpdatesResponse as ApiUpdatesResponse,
    ChatSummary as ApiChatSummary,
    ChatEvent as ApiDirectChatEvent,
    ChatEventWrapper as ApiDirectChatEventWrapper,
    GroupChatSummary as ApiGroupChatSummary,
    DirectChatSummary as ApiDirectChatSummary,
    UserCanisterGroupChatSummary as ApiUserCanisterGroupChatSummary,
    UserCanisterGroupChatSummaryUpdates as ApiUserCanisterGroupChatSummaryUpdates,
    UserId as ApiUserId,
    MessageContent as ApiMessageContent,
    MessageContentInitial as ApiMessageContentInitial,
    FileContent as ApiFileContent,
    TextContent as ApiTextContent,
    ImageContent as ApiImageContent,
    VideoContent as ApiVideoContent,
    AudioContent as ApiAudioContent,
    DeletedContent as ApiDeletedContent,
    CryptoContent as ApiCryptoContent,
    CryptoTransaction as ApiCryptoTransaction,
    NnsPendingCryptoTransaction as ApiNnsPendingCryptoTransaction,
    NnsCompletedCryptoTransaction as ApiNnsCompletedCryptoTransaction,
    NnsFailedCryptoTransaction as ApiNnsFailedCryptoTransaction,
    TimestampMillis as ApiTimestampMillis,
    BlobReference as ApiBlobReference,
    Participant as ApiParticipant,
    EventIndex as ApiEventIndex,
    EventsByIndexArgs as ApiEventsByIndexArgs,
    EventsResponse as ApiEventsResponse,
    EventsSuccessResult as ApiEventsSuccessResult,
    EventsArgs as ApiEventsArgs,
    BlockUserResponse as ApiBlockUserResponse,
    UnblockUserResponse as ApiUnblockUserResponse,
    LeaveGroupResponse as ApiLeaveGroupResponse,
    MarkReadResponse as ApiMarkReadResponse,
    SetAvatarResponse as ApiSetAvatarResponse,
    AddReactionResponse as ApiAddReactionResponse,
    RemoveReactionResponse as ApiRemoveReactionResponse,
    DeleteMessagesResponse as ApiDeleteMessageResponse,
    UndeleteMessagesResponse as ApiUndeleteMessageResponse,
    UpdatedMessage as ApiUpdatedMessage,
    SearchMessagesResponse as ApiSearchDirectChatResponse,
    MessageMatch as ApiMessageMatch,
    MuteNotificationsResponse as ApiMuteNotificationsResponse,
    UnmuteNotificationsResponse as ApiUnmuteNotificationsResponse,
    GroupRole as ApiGroupRole,
    Mention as ApiMention,
    User as ApiUser,
    ICP as ApiICP,
    SetBioResponse as ApiSetBioResponse,
    PollContent as ApiPollContent,
    PollVotes as ApiPollVotes,
    PollConfig as ApiPollConfig,
    TotalPollVotes as ApiTotalPollVotes,
    GroupPermissions as ApiGroupPermissions,
    PermissionRole as ApiPermissionRole,
    WithdrawCryptoResponse as ApiWithdrawCryptoResponse,
    PrizeContent as ApiPrizeContent,
    PrizeWinnerContent as ApiPrizeWinnerContent,
    PrizeContentInitial as ApiPrizeCotentInitial,
    GiphyContent as ApiGiphyContent,
    GiphyImageVariant as ApiGiphyImageVariant,
    ChatMetrics as ApiChatMetrics,
    Cryptocurrency as ApiCryptocurrency,
    PublicProfileResponse as ApiPublicProfileResponse,
    ThreadSummary as ApiThreadSummary,
    ProposalContent as ApiProposalContent,
    Proposal as ApiProposal,
    PinChatV2Response as ApiPinChatV2Response,
    UnpinChatV2Response as ApiUnpinV2ChatResponse,
    PinChatResponse as ApiPinChatResponse,
    UnpinChatResponse as ApiUnpinChatResponse,
    ProposalDecisionStatus as ApiProposalDecisionStatus,
    ProposalRewardStatus as ApiProposalRewardStatus,
    ThreadSyncDetails as ApiThreadSyncDetails,
    MigrateUserPrincipalResponse as ApiMigrateUserPrincipalResponse,
    GroupSubtype as ApiGroupSubtype,
    GovernanceProposalsSubtype as ApiGovernanceProposalsSubtype,
    GroupSubtypeUpdate as ApiGroupSubtypeUpdate,
    ArchiveChatResponse as ApiArchiveChatResponse,
    Icrc1Account as ApiIcrc1Account,
    DeletedMessageResponse as ApiDeletedDirectMessageResponse,
    SendMessageWithTransferToGroupArgs as ApiSendMessageWithTransferToGroupArgs,
    SendMessageWithTransferToGroupResponse as ApiSendMessageWithTransferToGroupResponse,
    SendMessageWithTransferToChannelArgs as ApiSendMessageWithTransferToChannelArgs,
    SendMessageWithTransferToChannelResponse as ApiSendMessageWithTransferToChannelResponse,
    AccessGate as ApiAccessGate,
    SetMessageReminderResponse as ApiSetMessageReminderResponse,
    MessageReminder as ApiMessageReminder,
    MessageReminderCreated as ApiMessageReminderCreated,
    CustomMessageContent as ApiCustomMessageContent,
    ReportedMessage as ApiReportedMessage,
    MessageReport as ApiMessageReport,
    CreateCommunityResponse as ApiCreateCommunityResponse,
    CommunityPermissions as ApiCommunityPermissions,
    CommunitiesInitial as ApiCommunitiesInitial,
    FavouriteChatsInitial as ApiFavouriteChatsInitial,
    GroupChatsInitial as ApiGroupChatsInitial,
    DirectChatsInitial as ApiDirectChatsInitial,
    CachedGroupChatSummaries as ApiCachedGroupChatSummaries,
    UserCanisterCommunitySummary as ApiUserCanisterCommunitySummary,
    UserCanisterChannelSummary as ApiUserCanisterChannelSummary,
    Chat as ApiChat,
    CommunitiesUpdates as ApiCommunitiesUpdates,
    FavouriteChatsUpdates as ApiFavouriteChatsUpdates,
    GroupChatsUpdates as ApiGroupChatsUpdates,
    DirectChatsUpdates as ApiDirectChatsUpdates,
    UserCanisterChannelSummaryUpdates as ApiUserCanisterChannelSummaryUpdates,
    UserCanisterCommunitySummaryUpdates as ApiUserCanisterCommunitySummaryUpdates,
    MarkReadArgs as ApiMarkReadArgs,
    CommunityMessagesRead as ApiCommunityMessagesRead,
    ChatMessagesRead as ApiChatMessagesRead,
    ChannelMessagesRead as ApiChannelMessagesRead,
    Icrc1CompletedCryptoTransaction as ApiIcrc1CompletedCryptoTransaction,
    Icrc1FailedCryptoTransaction as ApiIcrc1FailedCryptoTransaction,
    Icrc1PendingCryptoTransaction as ApiIcrc1PendingCryptoTransaction,
    CompletedCryptoTransaction as ApiCompletedCryptoTransaction,
    FailedCryptoTransaction as ApiFailedCryptoTransaction,
    PendingCryptoTransaction as ApiPendingCryptoTransaction,
    MultiUserChat as ApiMultiUserChat,
    ChatInList as ApiChatInList,
    ManageFavouriteChatsResponse as ApiManageFavouriteChatsResponse,
    LeaveCommunityResponse as ApiLeaveCommunityResponse,
    DeleteCommunityResponse as ApiDeleteCommunityResponse,
    ArchiveUnarchiveChatsResponse as ApiArchiveUnarchiveChatsResponse,
    SetCommunityIndexesResponse as ApiSetCommunityIndexesResponse,
    TipMessageResponse as ApiTipMessageResponse,
    SubmitProposalResponse as ApiSubmitProposalResponse,
};

export const idlFactory: IDL.InterfaceFactory;
