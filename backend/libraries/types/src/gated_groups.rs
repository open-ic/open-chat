use crate::{CanisterId, Milliseconds};
use candid::CandidType;
use icrc_ledger_types::icrc2::transfer_from::TransferFromError;
use serde::{Deserialize, Serialize};

pub const SNS_FEE_SHARE_PERCENT: u128 = 2;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub enum AccessGate {
    DiamondMember,
    VerifiedCredential(VerifiedCredentialGate),
    SnsNeuron(SnsNeuronGate),
    Payment(PaymentGate),
}

impl AccessGate {
    pub fn synchronous(&self) -> bool {
        matches!(self, AccessGate::DiamondMember)
    }
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub struct VerifiedCredentialGate {
    pub issuer: String,
    pub credential: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub struct SnsNeuronGate {
    pub governance_canister_id: CanisterId,
    pub min_stake_e8s: Option<u64>,
    pub min_dissolve_delay: Option<Milliseconds>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub struct PaymentGate {
    pub ledger_canister_id: CanisterId,
    pub amount: u128,
    pub fee: u128,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum GateCheckFailedReason {
    NotDiamondMember,
    NoSnsNeuronsFound,
    NoSnsNeuronsWithRequiredStakeFound,
    NoSnsNeuronsWithRequiredDissolveDelayFound,
    PaymentFailed(TransferFromError),
}
