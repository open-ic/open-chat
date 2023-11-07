use candid::CandidType;
use serde::{Deserialize, Serialize};
use types::{Message, MessageIndex, MultiUserChat, UserId};

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct Args {
    pub reporter: UserId,
    pub chat_id: MultiUserChat,
    pub thread_root_message_index: Option<MessageIndex>,
    pub message: Message,
    pub reason_code: u32,
    pub notes: Option<String>,
    pub already_deleted: bool,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub enum Response {
    Success,
    AlreadyReportedByUser,
}
