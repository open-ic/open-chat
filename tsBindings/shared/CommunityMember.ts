// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CommunityRole } from "./CommunityRole";
import type { UserId } from "./UserId";

export type CommunityMember = { user_id: UserId, date_added: bigint, role: CommunityRole, display_name?: string | undefined, referred_by?: UserId | undefined, lapsed: boolean, };
