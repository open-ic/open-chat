use candid::CandidType;
use serde::{Deserialize, Serialize};
use std::fmt;

use crate::MessageId;

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub enum AccessTokenType {
    StartVideoCall,
    JoinVideoCall(MessageId),
}

impl fmt::Display for AccessTokenType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}
