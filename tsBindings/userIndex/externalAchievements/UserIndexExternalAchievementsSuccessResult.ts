// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { TSBigIntWithDefault } from "../../shared/TSBigIntWithDefault";
import type { UserIndexExternalAchievementsExternalAchievement } from "./UserIndexExternalAchievementsExternalAchievement";

export type UserIndexExternalAchievementsSuccessResult = { last_updated: TSBigIntWithDefault, 
/**
 * @default []
 */
achievements_added: Array<UserIndexExternalAchievementsExternalAchievement>, 
/**
 * @default []
 */
achievements_removed: Array<UserIndexExternalAchievementsExternalAchievement>, };
