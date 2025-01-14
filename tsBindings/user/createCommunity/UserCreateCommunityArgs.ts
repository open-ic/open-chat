// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AccessGateConfig } from "../../shared/AccessGateConfig";
import type { CommunityPermissions } from "../../shared/CommunityPermissions";
import type { Document } from "../../shared/Document";
import type { Rules } from "../../shared/Rules";

export type UserCreateCommunityArgs = { is_public: boolean, name: string, description: string, rules: Rules, avatar?: Document | undefined, banner?: Document | undefined, history_visible_to_new_joiners: boolean, permissions?: CommunityPermissions | undefined, gate_config?: AccessGateConfig | undefined, default_channels: Array<string>, default_channel_rules?: Rules | undefined, primary_language: string, };
