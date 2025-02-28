// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ChatMetrics } from "./ChatMetrics";
import type { GroupCanisterThreadDetails } from "./GroupCanisterThreadDetails";
import type { GroupRole } from "./GroupRole";
import type { HydratedMention } from "./HydratedMention";

export type GroupMembership = { joined: bigint, role: GroupRole, mentions: Array<HydratedMention>, notifications_muted: boolean, my_metrics: ChatMetrics, latest_threads: Array<GroupCanisterThreadDetails>, rules_accepted: boolean, lapsed: boolean, };
