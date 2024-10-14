// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { MessageId } from "../../shared/MessageId";
import type { MessageIndex } from "../../shared/MessageIndex";

export type GroupDeleteMessagesArgs = { thread_root_message_index?: MessageIndex | undefined, 
/**
 * @default []
 */
message_ids: Array<MessageId>, as_platform_moderator?: boolean | undefined, 
/**
 * @default false
 */
new_achievement: boolean, correlation_id: bigint, };
