// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ChatMetrics } from "./ChatMetrics";
import type { CommunityCanisterChannelSummary } from "./CommunityCanisterChannelSummary";
import type { CommunityCanisterChannelSummaryUpdates } from "./CommunityCanisterChannelSummaryUpdates";
import type { CommunityId } from "./CommunityId";
import type { CommunityMembershipUpdates } from "./CommunityMembershipUpdates";
import type { CommunityPermissions } from "./CommunityPermissions";
import type { EventIndex } from "./EventIndex";
import type { OptionUpdateAccessGate } from "./OptionUpdateAccessGate";
import type { OptionUpdateAccessGateConfig } from "./OptionUpdateAccessGateConfig";
import type { OptionUpdateFrozenGroupInfo } from "./OptionUpdateFrozenGroupInfo";
import type { OptionUpdateU128 } from "./OptionUpdateU128";
import type { UserGroupSummary } from "./UserGroupSummary";

export type CommunityCanisterCommunitySummaryUpdates = { community_id: CommunityId, last_updated: bigint, name?: string | undefined, description?: string | undefined, avatar_id: OptionUpdateU128, banner_id: OptionUpdateU128, is_public?: boolean | undefined, member_count?: number | undefined, permissions?: CommunityPermissions | undefined, frozen: OptionUpdateFrozenGroupInfo, gate: OptionUpdateAccessGate, gate_config: OptionUpdateAccessGateConfig, primary_language?: string | undefined, latest_event_index?: EventIndex | undefined, channels_added: Array<CommunityCanisterChannelSummary>, channels_updated: Array<CommunityCanisterChannelSummaryUpdates>, channels_removed: Array<bigint>, membership?: CommunityMembershipUpdates | undefined, user_groups: Array<UserGroupSummary>, user_groups_deleted: Array<number>, metrics?: ChatMetrics | undefined, };
