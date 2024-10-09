// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { FieldTooLongResult } from "../../shared/FieldTooLongResult";
import type { FieldTooShortResult } from "../../shared/FieldTooShortResult";
import type { GroupUpdateGroupSuccessResult } from "./GroupUpdateGroupSuccessResult";

export type GroupUpdateGroupResponse = { "SuccessV2": GroupUpdateGroupSuccessResult } | "NotAuthorized" | "CallerNotInGroup" | { "NameTooShort": FieldTooShortResult } | { "NameTooLong": FieldTooLongResult } | "NameReserved" | { "DescriptionTooLong": FieldTooLongResult } | { "RulesTooShort": FieldTooShortResult } | { "RulesTooLong": FieldTooLongResult } | { "AvatarTooBig": FieldTooLongResult } | "AccessGateInvalid" | "NameTaken" | "UserSuspended" | "UserLapsed" | "ChatFrozen" | "InternalError";
