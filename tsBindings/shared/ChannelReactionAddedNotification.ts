// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ChannelId } from "./ChannelId";
import type { CommunityId } from "./CommunityId";
import type { EventIndex } from "./EventIndex";
import type { MessageIndex } from "./MessageIndex";
import type { Reaction } from "./Reaction";
import type { UserId } from "./UserId";

export type ChannelReactionAddedNotification = { community_id: CommunityId, channel_id: ChannelId, thread_root_message_index?: MessageIndex, message_index: MessageIndex, message_event_index: EventIndex, community_name: string, channel_name: string, added_by: UserId, added_by_name: string, added_by_display_name?: string, reaction: Reaction, community_avatar_id?: bigint, channel_avatar_id?: bigint, };
