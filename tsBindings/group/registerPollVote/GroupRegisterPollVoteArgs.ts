// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { MessageIndex } from "../../shared/MessageIndex";
import type { VoteOperation } from "../../shared/VoteOperation";

export type GroupRegisterPollVoteArgs = { thread_root_message_index?: MessageIndex | undefined, message_index: MessageIndex, poll_option: number, operation: VoteOperation, new_achievement: boolean, correlation_id: bigint, };
