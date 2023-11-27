use candid::CandidType;
use serde::{Deserialize, Serialize};
use types::{local_user_index_canister_id, AccessGate, CanisterId, CommunityId, CommunityPermissions, Document, Rules};

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct Args {
    pub is_public: bool,
    pub name: String,
    pub description: String,
    pub rules: Rules,
    pub avatar: Option<Document>,
    pub banner: Option<Document>,
    pub history_visible_to_new_joiners: bool,
    pub permissions: Option<CommunityPermissions>,
    pub gate: Option<AccessGate>,
    pub default_channels: Vec<String>,
    pub default_channel_rules: Option<Rules>,
    pub primary_language: String,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub enum Response {
    Success(SuccessResult),
    NameTaken,
    UserNotFound,
    InternalError(String),
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
#[serde(from = "SuccessResultPrevious")]
pub struct SuccessResult {
    pub community_id: CommunityId,
    pub local_user_index_canister_id: CanisterId,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct SuccessResultPrevious {
    pub community_id: CommunityId,
}

impl From<SuccessResultPrevious> for SuccessResult {
    fn from(value: SuccessResultPrevious) -> Self {
        SuccessResult {
            community_id: value.community_id,
            local_user_index_canister_id: local_user_index_canister_id(value.community_id.into()),
        }
    }
}
