// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ChitEarned } from "../../shared/ChitEarned";
import type { OptionUpdatePinNumberSettings } from "../../shared/OptionUpdatePinNumberSettings";
import type { OptionUpdateString } from "../../shared/OptionUpdateString";
import type { OptionUpdateU128 } from "../../shared/OptionUpdateU128";
import type { UserId } from "../../shared/UserId";
import type { UserReferral } from "../UserReferral";
import type { UserUpdatesCommunitiesUpdates } from "./UserUpdatesCommunitiesUpdates";
import type { UserUpdatesDirectChatsUpdates } from "./UserUpdatesDirectChatsUpdates";
import type { UserUpdatesFavouriteChatsUpdates } from "./UserUpdatesFavouriteChatsUpdates";
import type { UserUpdatesGroupChatsUpdates } from "./UserUpdatesGroupChatsUpdates";
import type { UserWalletConfig } from "../UserWalletConfig";

export type UserUpdatesSuccessResult = { timestamp: bigint, username?: string, display_name: OptionUpdateString, direct_chats: UserUpdatesDirectChatsUpdates, group_chats: UserUpdatesGroupChatsUpdates, favourite_chats: UserUpdatesFavouriteChatsUpdates, communities: UserUpdatesCommunitiesUpdates, avatar_id: OptionUpdateU128, blocked_users?: Array<UserId>, suspended?: boolean, pin_number_settings: OptionUpdatePinNumberSettings, achievements: Array<ChitEarned>, achievements_last_seen?: bigint, total_chit_earned: number, chit_balance: number, streak: number, streak_ends: bigint, next_daily_claim: bigint, is_unique_person?: boolean, wallet_config?: UserWalletConfig, referrals: Array<UserReferral>, };
