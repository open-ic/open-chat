use candid::CandidType;
use serde::Deserialize;
use types::{AddedToGroupNotification, UserId};

#[derive(CandidType, Deserialize, Debug)]
pub struct Args {
    pub recipients: Vec<UserId>,
    pub notification: AddedToGroupNotification,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum Response {
    Success,
}
