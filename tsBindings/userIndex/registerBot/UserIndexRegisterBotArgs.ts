// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { BotDefinition } from "../../shared/BotDefinition";
import type { TSBytes } from "../../shared/TSBytes";
import type { UserId } from "../../shared/UserId";

export type UserIndexRegisterBotArgs = { principal: TSBytes, owner: UserId, name: string, avatar?: string | undefined, endpoint: string, definition: BotDefinition, };
