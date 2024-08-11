// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AccessGate } from "./AccessGate";
import type { ChatMetrics } from "./ChatMetrics";
import type { CommunityCanisterChannelSummary } from "./CommunityCanisterChannelSummary";
import type { CommunityCanisterChannelSummaryUpdates } from "./CommunityCanisterChannelSummaryUpdates";
import type { CommunityId } from "./CommunityId";
import type { CommunityMembershipUpdates } from "./CommunityMembershipUpdates";
import type { CommunityPermissions } from "./CommunityPermissions";
import type { EventIndex } from "./EventIndex";
import type { FrozenGroupInfo } from "./FrozenGroupInfo";
import type { OptionUpdate } from "./OptionUpdate";
import type { UserGroupSummary } from "./UserGroupSummary";

export type CommunityCanisterCommunitySummaryUpdates = { community_id: CommunityId, last_updated: bigint, name: string | null, description: string | null, avatar_id: OptionUpdate<bigint>, banner_id: OptionUpdate<bigint>, is_public: boolean | null, member_count: number | null, permissions: CommunityPermissions | null, frozen: OptionUpdate<FrozenGroupInfo>, gate: OptionUpdate<AccessGate>, primary_language: string | null, latest_event_index: EventIndex | null, channels_added: Array<CommunityCanisterChannelSummary>, channels_updated: Array<CommunityCanisterChannelSummaryUpdates>, channels_removed: Array<bigint>, membership: CommunityMembershipUpdates | null, user_groups: Array<UserGroupSummary>, user_groups_deleted: Array<number>, metrics: ChatMetrics | null, };
