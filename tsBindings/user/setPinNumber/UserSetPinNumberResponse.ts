// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { FieldTooLongResult } from "../../shared/FieldTooLongResult";
import type { FieldTooShortResult } from "../../shared/FieldTooShortResult";

export type UserSetPinNumberResponse = "Success" | { "TooShort": FieldTooShortResult } | { "TooLong": FieldTooLongResult } | "PinRequired" | { "PinIncorrect": bigint } | { "TooManyFailedPinAttempts": bigint };
