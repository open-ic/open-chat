// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Chat } from "./Chat";
import type { MessageId } from "./MessageId";
import type { MessageIndex } from "./MessageIndex";

export type Message = { chat: Chat, thread_root_message_index: MessageIndex | null, message_id: MessageId, };
