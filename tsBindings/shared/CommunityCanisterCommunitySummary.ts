// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AccessGate } from "./AccessGate";
import type { AccessGateConfig } from "./AccessGateConfig";
import type { ChatMetrics } from "./ChatMetrics";
import type { CommunityCanisterChannelSummary } from "./CommunityCanisterChannelSummary";
import type { CommunityId } from "./CommunityId";
import type { CommunityMembership } from "./CommunityMembership";
import type { CommunityPermissions } from "./CommunityPermissions";
import type { EventIndex } from "./EventIndex";
import type { FrozenGroupInfo } from "./FrozenGroupInfo";
import type { TSBytes } from "./TSBytes";
import type { UserGroupSummary } from "./UserGroupSummary";

export type CommunityCanisterCommunitySummary = { community_id: CommunityId, local_user_index_canister_id: TSBytes, last_updated: bigint, name: string, description: string, avatar_id?: bigint, banner_id?: bigint, is_public: boolean, member_count: number, permissions: CommunityPermissions, frozen?: FrozenGroupInfo, gate?: AccessGate, gate_config?: AccessGateConfig, primary_language: string, latest_event_index: EventIndex, channels: Array<CommunityCanisterChannelSummary>, membership?: CommunityMembership, user_groups: Array<UserGroupSummary>, is_invited?: boolean, metrics: ChatMetrics, };
