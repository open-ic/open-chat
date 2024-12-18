// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CompletedCryptoTransaction } from "../../shared/CompletedCryptoTransaction";
import type { Cryptocurrency } from "../../shared/Cryptocurrency";
import type { UserSendMessageWithTransferToGroupSuccessResult } from "./UserSendMessageWithTransferToGroupSuccessResult";

export type UserSendMessageWithTransferToGroupResponse = { "Success": UserSendMessageWithTransferToGroupSuccessResult } | { "TextTooLong": number } | "RecipientBlocked" | { "CallerNotInGroup": CompletedCryptoTransaction | null } | { "CryptocurrencyNotSupported": Cryptocurrency } | { "InvalidRequest": string } | { "TransferFailed": string } | "TransferCannotBeZero" | "TransferCannotBeToSelf" | { "P2PSwapSetUpFailed": string } | "UserSuspended" | "UserLapsed" | "ChatFrozen" | "RulesNotAccepted" | "MessageAlreadyExists" | { "Retrying": [string, CompletedCryptoTransaction] } | "PinRequired" | { "PinIncorrect": bigint } | { "TooManyFailedPinAttempts": bigint } | { "InternalError": string };
