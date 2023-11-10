use candid::CandidType;
use serde::{Deserialize, Serialize};
use types::{EventIndex, MessageIndex, TimestampMillis};

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct Args {
    pub thread_root_message_index: Option<MessageIndex>,
    pub events: Vec<EventIndex>,
    pub latest_known_update: Option<TimestampMillis>,
}

pub use crate::EventsResponse as Response;
