// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ChatMetrics } from "./ChatMetrics";
import type { GroupCanisterThreadDetails } from "./GroupCanisterThreadDetails";
import type { GroupRole } from "./GroupRole";
import type { HydratedMention } from "./HydratedMention";

export type GroupMembership = { joined: bigint, 
/**
 * @default Participant
 */
role: GroupRole, 
/**
 * @default []
 */
mentions: Array<HydratedMention>, 
/**
 * @default false
 */
notifications_muted: boolean, my_metrics: ChatMetrics, 
/**
 * @default []
 */
latest_threads: Array<GroupCanisterThreadDetails>, 
/**
 * @default false
 */
rules_accepted: boolean, 
/**
 * @default false
 */
lapsed: boolean, };
