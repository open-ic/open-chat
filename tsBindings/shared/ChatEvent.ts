// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AvatarChanged } from "./AvatarChanged";
import type { DirectChatCreated } from "./DirectChatCreated";
import type { EventsTimeToLiveUpdated } from "./EventsTimeToLiveUpdated";
import type { ExternalUrlUpdated } from "./ExternalUrlUpdated";
import type { GroupCreated } from "./GroupCreated";
import type { GroupDescriptionChanged } from "./GroupDescriptionChanged";
import type { GroupFrozen } from "./GroupFrozen";
import type { GroupGateUpdated } from "./GroupGateUpdated";
import type { GroupInviteCodeChanged } from "./GroupInviteCodeChanged";
import type { GroupNameChanged } from "./GroupNameChanged";
import type { GroupRulesChanged } from "./GroupRulesChanged";
import type { GroupUnfrozen } from "./GroupUnfrozen";
import type { GroupVisibilityChanged } from "./GroupVisibilityChanged";
import type { MemberJoined } from "./MemberJoined";
import type { MemberLeft } from "./MemberLeft";
import type { MembersAdded } from "./MembersAdded";
import type { MembersAddedToDefaultChannel } from "./MembersAddedToDefaultChannel";
import type { MembersRemoved } from "./MembersRemoved";
import type { Message } from "./Message";
import type { MessagePinned } from "./MessagePinned";
import type { MessageUnpinned } from "./MessageUnpinned";
import type { PermissionsChanged } from "./PermissionsChanged";
import type { RoleChanged } from "./RoleChanged";
import type { UsersBlocked } from "./UsersBlocked";
import type { UsersInvited } from "./UsersInvited";
import type { UsersUnblocked } from "./UsersUnblocked";

export type ChatEvent = "Empty" | { "Message": Message } | { "GroupChatCreated": GroupCreated } | { "DirectChatCreated": DirectChatCreated } | { "GroupNameChanged": GroupNameChanged } | { "GroupDescriptionChanged": GroupDescriptionChanged } | { "GroupRulesChanged": GroupRulesChanged } | { "AvatarChanged": AvatarChanged } | { "ParticipantsAdded": MembersAdded } | { "ParticipantsRemoved": MembersRemoved } | { "ParticipantJoined": MemberJoined } | { "ParticipantLeft": MemberLeft } | { "RoleChanged": RoleChanged } | { "UsersBlocked": UsersBlocked } | { "UsersUnblocked": UsersUnblocked } | { "MessagePinned": MessagePinned } | { "MessageUnpinned": MessageUnpinned } | { "PermissionsChanged": PermissionsChanged } | { "GroupVisibilityChanged": GroupVisibilityChanged } | { "GroupInviteCodeChanged": GroupInviteCodeChanged } | { "ChatFrozen": GroupFrozen } | { "ChatUnfrozen": GroupUnfrozen } | { "EventsTimeToLiveUpdated": EventsTimeToLiveUpdated } | { "GroupGateUpdated": GroupGateUpdated } | { "UsersInvited": UsersInvited } | { "MembersAddedToDefaultChannel": MembersAddedToDefaultChannel } | { "ExternalUrlUpdated": ExternalUrlUpdated };
