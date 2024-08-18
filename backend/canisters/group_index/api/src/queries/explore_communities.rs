use candid::CandidType;
use serde::{Deserialize, Serialize};
use ts_gen::ts_export;
use types::CommunityMatch;

#[derive(CandidType, Serialize, Deserialize, Debug)]
#[ts_export(group_index, explore_communities)]
pub struct Args {
    #[ts(optional)]
    pub search_term: Option<String>,
    pub languages: Vec<String>,
    pub page_index: u32,
    pub page_size: u8,
    pub include_moderation_flags: u32,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
#[ts_export(group_index, explore_communities)]
pub enum Response {
    Success(SuccessResult),
    TermTooShort(u8),
    TermTooLong(u8),
    InvalidTerm,
    InvalidFlags,
}

#[derive(CandidType, Serialize, Deserialize, Debug)]
#[ts_export(group_index, explore_communities)]
pub struct SuccessResult {
    pub matches: Vec<CommunityMatch>,
    pub total: u32,
}
