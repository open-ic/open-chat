// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ChitEarned } from "../../shared/ChitEarned";
import type { PinNumberSettings } from "../../shared/PinNumberSettings";
import type { TSBigIntWithDefault } from "../../shared/TSBigIntWithDefault";
import type { TSBoolWithDefault } from "../../shared/TSBoolWithDefault";
import type { TSBytes } from "../../shared/TSBytes";
import type { TSNumberWithDefault } from "../../shared/TSNumberWithDefault";
import type { UserId } from "../../shared/UserId";
import type { UserInitialStateCommunitiesInitial } from "./UserInitialStateCommunitiesInitial";
import type { UserInitialStateDirectChatsInitial } from "./UserInitialStateDirectChatsInitial";
import type { UserInitialStateFavouriteChatsInitial } from "./UserInitialStateFavouriteChatsInitial";
import type { UserInitialStateGroupChatsInitial } from "./UserInitialStateGroupChatsInitial";
import type { UserMessageActivitySummary } from "../UserMessageActivitySummary";
import type { UserReferral } from "../UserReferral";
import type { UserWalletConfig } from "../UserWalletConfig";

export type UserInitialStateSuccessResult = { timestamp: TSBigIntWithDefault, direct_chats: UserInitialStateDirectChatsInitial, group_chats: UserInitialStateGroupChatsInitial, favourite_chats: UserInitialStateFavouriteChatsInitial, communities: UserInitialStateCommunitiesInitial, avatar_id?: bigint | undefined, 
/**
 * @default []
 */
blocked_users: Array<UserId>, suspended: TSBoolWithDefault, pin_number_settings?: PinNumberSettings | undefined, local_user_index_canister_id: TSBytes, 
/**
 * @default []
 */
achievements: Array<ChitEarned>, achievements_last_seen: TSBigIntWithDefault, total_chit_earned: TSNumberWithDefault, chit_balance: TSNumberWithDefault, streak: TSNumberWithDefault, streak_ends: TSBigIntWithDefault, next_daily_claim: TSBigIntWithDefault, is_unique_person: TSBoolWithDefault, wallet_config: UserWalletConfig, 
/**
 * @default []
 */
referrals: Array<UserReferral>, message_activity_summary: UserMessageActivitySummary, };
