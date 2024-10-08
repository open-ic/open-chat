// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AccessGate } from "./AccessGate";
import type { AccessGateConfig } from "./AccessGateConfig";
import type { CommunityId } from "./CommunityId";

export type CommunityMatch = { id: CommunityId, score: number, name: string, description: string, avatar_id?: bigint, banner_id?: bigint, member_count: number, channel_count: number, gate?: AccessGate, gate_config?: AccessGateConfig, moderation_flags: number, primary_language: string, };
