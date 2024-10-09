// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { CommunitySearchChannelSuccessResult } from "./CommunitySearchChannelSuccessResult";

export type CommunitySearchChannelResponse = { "Success": CommunitySearchChannelSuccessResult } | "InvalidTerm" | { "TermTooLong": number } | { "TermTooShort": number } | { "TooManyUsers": number } | "UserNotInCommunity" | "ChannelNotFound" | "UserNotInChannel";
