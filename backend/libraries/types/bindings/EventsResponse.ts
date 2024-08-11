// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ChatEvent } from "./ChatEvent";
import type { EventIndex } from "./EventIndex";
import type { EventWrapper } from "./EventWrapper";
import type { MessageIndex } from "./MessageIndex";

export type EventsResponse = { events: Array<EventWrapper<ChatEvent>>, expired_event_ranges: Array<[EventIndex, EventIndex]>, expired_message_ranges: Array<[MessageIndex, MessageIndex]>, latest_event_index: EventIndex, chat_last_updated: bigint, };
