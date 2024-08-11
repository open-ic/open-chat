// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { InvalidPollReason } from "./InvalidPollReason";

export type ContentValidationError = "Empty" | { "TextTooLong": number } | { "InvalidPoll": InvalidPollReason } | "TransferCannotBeZero" | "InvalidTypeForForwarding" | "PrizeEndDateInThePast" | "Unauthorized";
