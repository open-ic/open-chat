// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AccessGate } from "../../shared/AccessGate";
import type { AccessGateConfig } from "../../shared/AccessGateConfig";
import type { Document } from "../../shared/Document";
import type { GroupPermissions } from "../../shared/GroupPermissions";
import type { GroupSubtype } from "../../shared/GroupSubtype";
import type { Rules } from "../../shared/Rules";

export type CommunityCreateChannelArgs = { 
/**
 * @default false
 */
is_public: boolean, name: string, description: string, rules: Rules, subtype?: GroupSubtype | undefined, avatar?: Document | undefined, 
/**
 * @default false
 */
history_visible_to_new_joiners: boolean, messages_visible_to_non_members?: boolean | undefined, permissions_v2?: GroupPermissions | undefined, events_ttl?: bigint | undefined, gate?: AccessGate | undefined, gate_config?: AccessGateConfig | undefined, external_url?: string | undefined, };
