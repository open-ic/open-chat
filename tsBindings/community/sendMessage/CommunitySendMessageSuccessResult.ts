// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { EventIndex } from "../../shared/EventIndex";
import type { MessageIndex } from "../../shared/MessageIndex";

export type CommunitySendMessageSuccessResult = { 
/**
 * @default 0
 */
event_index: EventIndex, 
/**
 * @default 0
 */
message_index: MessageIndex, timestamp: bigint, expires_at?: bigint | undefined, };
