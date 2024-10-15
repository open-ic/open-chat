// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CommunityId } from "../shared/CommunityId";
import type { TSBytes } from "../shared/TSBytes";
import type { UserChannelSummary } from "./UserChannelSummary";

export type UserCommunitySummary = { community_id: CommunityId, local_user_index_canister_id: TSBytes, channels: Array<UserChannelSummary>, index: number, archived: boolean, pinned: Array<bigint>, };
