// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { EventIndex } from "./EventIndex";
import type { Message } from "./Message";

export type EventWrapperMessage = { index: EventIndex, timestamp: bigint, correlation_id: bigint, expires_at?: bigint, event: Message, };
