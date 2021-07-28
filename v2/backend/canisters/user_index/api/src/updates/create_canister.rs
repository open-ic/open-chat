use candid::CandidType;
use serde::Deserialize;
use shared::types::CanisterId;

#[derive(CandidType, Deserialize)]
pub struct Args {}

#[derive(CandidType, Deserialize)]
pub enum Response {
    Success(CanisterId),
    UserNotFound,
    UserUnconfirmed,
    UserAlreadyCreated,
    CreationInProgress,
    CyclesBalanceTooLow,
    InternalError,
}
