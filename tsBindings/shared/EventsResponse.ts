// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { EventIndex } from "./EventIndex";
import type { EventWrapperChatEvent } from "./EventWrapperChatEvent";
import type { MessageIndex } from "./MessageIndex";

export type EventsResponse = { 
/**
 * @default []
 */
events: Array<EventWrapperChatEvent>, 
/**
 * @default []
 */
expired_event_ranges: Array<[EventIndex, EventIndex]>, 
/**
 * @default []
 */
expired_message_ranges: Array<[MessageIndex, MessageIndex]>, 
/**
 * @default 0
 */
latest_event_index: EventIndex, chat_last_updated: bigint, };
