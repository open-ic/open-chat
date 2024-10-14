// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { MessageContent } from "./MessageContent";
import type { MessageIndex } from "./MessageIndex";
import type { UserId } from "./UserId";

export type MessageMatch = { sender: UserId, 
/**
 * @default 0
 */
message_index: MessageIndex, content: MessageContent, 
/**
 * @default 0
 */
score: number, };
