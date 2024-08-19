use crate::{TimestampMillis, UserId};
use candid::CandidType;
use serde::{Deserialize, Serialize};
use ts_optional::ts_optional;
use ts_rs::TS;

pub type FrozenCommunityInfo = FrozenGroupInfo;

#[ts_optional]
#[derive(CandidType, Serialize, Deserialize, Debug, Clone, TS)]
pub struct FrozenGroupInfo {
    pub timestamp: TimestampMillis,
    pub frozen_by: UserId,
    pub reason: Option<String>,
}
