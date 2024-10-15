// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CommunityMember } from "../../shared/CommunityMember";
import type { EventIndex } from "../../shared/EventIndex";
import type { UserGroupDetails } from "../../shared/UserGroupDetails";
import type { UserId } from "../../shared/UserId";
import type { VersionedRules } from "../../shared/VersionedRules";

export type CommunitySelectedInitialSuccessResult = { timestamp: bigint, last_updated: bigint, latest_event_index: EventIndex, members: Array<CommunityMember>, basic_members: Array<UserId>, blocked_users: Array<UserId>, invited_users: Array<UserId>, chat_rules: VersionedRules, user_groups: Array<UserGroupDetails>, referrals: Array<UserId>, };
