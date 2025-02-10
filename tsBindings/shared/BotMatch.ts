// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AutonomousConfig } from "./AutonomousConfig";
import type { SlashCommandSchema } from "./SlashCommandSchema";
import type { UserId } from "./UserId";

export type BotMatch = { id: UserId, score: number, name: string, description: string, owner: UserId, avatar_id?: bigint, commands: Array<SlashCommandSchema>, autonomous_config?: AutonomousConfig, };
