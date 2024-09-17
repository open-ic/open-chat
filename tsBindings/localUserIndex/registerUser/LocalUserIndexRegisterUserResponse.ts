// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { LocalUserIndexRegisterUserSuccessResult } from "./LocalUserIndexRegisterUserSuccessResult";

export type LocalUserIndexRegisterUserResponse = { "Success": LocalUserIndexRegisterUserSuccessResult } | "RegistrationInProgress" | "AlreadyRegistered" | "UserLimitReached" | "UsernameInvalid" | { "UsernameTooShort": number } | { "UsernameTooLong": number } | "CyclesBalanceTooLow" | { "InternalError": string } | { "PublicKeyInvalid": string } | "ReferralCodeInvalid" | "ReferralCodeAlreadyClaimed" | "ReferralCodeExpired";
