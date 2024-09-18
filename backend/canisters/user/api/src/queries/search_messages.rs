use candid::CandidType;
use serde::{Deserialize, Serialize};
use ts_export::ts_export;
use types::{MessageMatch, UserId};

#[ts_export(user, search_messages)]
#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct Args {
    pub user_id: UserId,
    pub search_term: String,
    pub max_results: u8,
}

#[ts_export(user, search_messages)]
#[derive(CandidType, Serialize, Deserialize, Debug)]
pub enum Response {
    Success(SuccessResult),
    InvalidTerm,
    TermTooLong(u8),
    TermTooShort(u8),
    ChatNotFound,
}

#[ts_export(user, search_messages)]
#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct SuccessResult {
    pub matches: Vec<MessageMatch>,
}
