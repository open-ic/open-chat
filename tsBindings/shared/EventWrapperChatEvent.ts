// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ChatEvent } from "./ChatEvent";
import type { EventIndex } from "./EventIndex";

export type EventWrapperChatEvent = { 
/**
 * @default 0
 */
index: EventIndex, timestamp: bigint, correlation_id: bigint, expires_at?: bigint | undefined, event: ChatEvent, };
