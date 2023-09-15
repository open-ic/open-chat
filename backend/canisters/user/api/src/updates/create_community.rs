use candid::CandidType;
use serde::{Deserialize, Serialize};
use types::{AccessGate, CommunityId, CommunityPermissions, Document, FieldTooLongResult, FieldTooShortResult, Rules};

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
    #[serde(default)]
    pub default_channel_rules: Option<Rules>,
    pub primary_language: String,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub enum Response {
    Success(SuccessResult),
    NameTooShort(FieldTooShortResult),
    NameTooLong(FieldTooLongResult),
    NameReserved,
    DescriptionTooLong(FieldTooLongResult),
    RulesTooShort(FieldTooShortResult),
    RulesTooLong(FieldTooLongResult),
    AvatarTooBig(FieldTooLongResult),
    BannerTooBig(FieldTooLongResult),
    MaxCommunitiesCreated(u32),
    NameTaken,
    Throttled,
    UserSuspended,
    Unauthorized,
    DefaultChannelsInvalid,
    InternalError(String),
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
pub struct SuccessResult {
    pub community_id: CommunityId,
}
