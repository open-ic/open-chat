use candid::CandidType;
use serde::{Deserialize, Serialize};
use ts_export::ts_export;
use types::{EventIndex, MessageIndex, TimestampMillis, UserId};

#[ts_export(user, events)]
#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct Args {
    pub user_id: UserId,
    pub thread_root_message_index: Option<MessageIndex>,
    #[ts(skip)]
    pub bot_caller: Option<UserId>,
    pub start_index: EventIndex,
    pub ascending: bool,
    pub max_messages: u32,
    pub max_events: u32,
    pub latest_known_update: Option<TimestampMillis>,
}

pub use crate::EventsResponse as Response;
