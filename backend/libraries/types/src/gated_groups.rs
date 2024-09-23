use crate::icrc2::TransferFromError;
use crate::{CanisterId, Milliseconds};
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_export::ts_export;

pub const SNS_FEE_SHARE_PERCENT: u128 = 2;

#[ts_export]
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
#[serde(from = "AccessGateCombined")]
pub struct AccessGateConfig {
    pub gate: AccessGate,
    pub expiry: Option<Milliseconds>,
}

impl AccessGateConfig {
    pub fn expiry(&self) -> Option<Milliseconds> {
        match self.gate {
            AccessGate::Composite(_) | AccessGate::Locked | AccessGate::ReferredByMember => None,
            _ => self.expiry,
        }
    }

    pub fn gate(&self) -> &AccessGate {
        &self.gate
    }
}

// TODO: Delete this after it is released
impl From<AccessGate> for AccessGateConfig {
    fn from(value: AccessGate) -> Self {
        AccessGateConfig {
            gate: value,
            expiry: None,
        }
    }
}

impl From<AccessGateCombined> for AccessGateConfig {
    fn from(value: AccessGateCombined) -> Self {
        match value {
            AccessGateCombined::AccessGateConfig(access_gate_config) => access_gate_config,
            AccessGateCombined::Accessgate(access_gate) => access_gate.into(),
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(untagged)]
pub enum AccessGateCombined {
    AccessGateConfig(AccessGateConfig),
    Accessgate(AccessGate),
}

#[ts_export]
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub enum AccessGate {
    DiamondMember,
    LifetimeDiamondMember,
    UniquePerson,
    VerifiedCredential(VerifiedCredentialGate),
    SnsNeuron(SnsNeuronGate),
    Payment(PaymentGate),
    TokenBalance(TokenBalanceGate),
    Composite(CompositeGate),
    Locked,
    ReferredByMember,
}

#[derive(Serialize, Deserialize, Eq, PartialEq)]
pub enum AccessGateType {
    DiamondMember,
    LifetimeDiamondMember,
    UniquePerson,
    VerifiedCredential,
    SnsNeuron,
    Payment,
    TokenBalance,
    Composite,
    Locked,
    ReferredByMember,
}

#[ts_export]
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub enum AccessGateNonComposite {
    DiamondMember,
    LifetimeDiamondMember,
    UniquePerson,
    VerifiedCredential(VerifiedCredentialGate),
    SnsNeuron(SnsNeuronGate),
    Payment(PaymentGate),
    TokenBalance(TokenBalanceGate),
    Locked,
    ReferredByMember,
}

pub enum AccessGateScope {
    Composite(CompositeGate),
    NonComposite(AccessGateNonComposite),
}

#[derive(Serialize, Deserialize, Eq, PartialEq)]
pub enum AccessGateExpiryType {
    Batch,
    Single,
    Lapse,
    Invalid,
}

impl From<AccessGate> for AccessGateScope {
    fn from(value: AccessGate) -> Self {
        match value {
            AccessGate::Composite(gate) => AccessGateScope::Composite(gate),
            AccessGate::DiamondMember => AccessGateScope::NonComposite(AccessGateNonComposite::DiamondMember),
            AccessGate::LifetimeDiamondMember => AccessGateScope::NonComposite(AccessGateNonComposite::LifetimeDiamondMember),
            AccessGate::UniquePerson => AccessGateScope::NonComposite(AccessGateNonComposite::UniquePerson),
            AccessGate::VerifiedCredential(gate) => {
                AccessGateScope::NonComposite(AccessGateNonComposite::VerifiedCredential(gate))
            }
            AccessGate::SnsNeuron(gate) => AccessGateScope::NonComposite(AccessGateNonComposite::SnsNeuron(gate)),
            AccessGate::Payment(gate) => AccessGateScope::NonComposite(AccessGateNonComposite::Payment(gate)),
            AccessGate::TokenBalance(gate) => AccessGateScope::NonComposite(AccessGateNonComposite::TokenBalance(gate)),
            AccessGate::Locked => AccessGateScope::NonComposite(AccessGateNonComposite::Locked),
            AccessGate::ReferredByMember => AccessGateScope::NonComposite(AccessGateNonComposite::ReferredByMember),
        }
    }
}

impl From<&AccessGate> for AccessGateExpiryType {
    fn from(value: &AccessGate) -> Self {
        match value {
            AccessGate::DiamondMember | AccessGate::LifetimeDiamondMember | AccessGate::UniquePerson => {
                AccessGateExpiryType::Batch
            }
            AccessGate::Payment(_) | AccessGate::VerifiedCredential(_) => AccessGateExpiryType::Lapse,
            AccessGate::SnsNeuron(_) | AccessGate::TokenBalance(_) => AccessGateExpiryType::Single,
            _ => AccessGateExpiryType::Invalid,
        }
    }
}

impl From<&AccessGate> for AccessGateType {
    fn from(value: &AccessGate) -> Self {
        match value {
            AccessGate::DiamondMember => AccessGateType::DiamondMember,
            AccessGate::LifetimeDiamondMember => AccessGateType::LifetimeDiamondMember,
            AccessGate::UniquePerson => AccessGateType::UniquePerson,
            AccessGate::VerifiedCredential(_) => AccessGateType::VerifiedCredential,
            AccessGate::SnsNeuron(_) => AccessGateType::SnsNeuron,
            AccessGate::Payment(_) => AccessGateType::Payment,
            AccessGate::TokenBalance(_) => AccessGateType::TokenBalance,
            AccessGate::Composite(_) => AccessGateType::Composite,
            AccessGate::Locked => AccessGateType::Locked,
            AccessGate::ReferredByMember => AccessGateType::ReferredByMember,
        }
    }
}

impl AccessGate {
    pub fn validate(&self) -> bool {
        if let AccessGate::Composite(g) = self {
            if g.inner.is_empty() || g.inner.len() > 10 {
                return false;
            }
        }
        true
    }

    pub fn is_payment_gate(&self) -> bool {
        matches!(self, AccessGate::Payment(_))
    }

    pub fn gate_type(&self) -> &'static str {
        match self {
            AccessGate::DiamondMember => "diamond",
            AccessGate::LifetimeDiamondMember => "lifetime_diamond",
            AccessGate::UniquePerson => "unique_person",
            AccessGate::VerifiedCredential(_) => "verified_credential",
            AccessGate::SnsNeuron(_) => "sns_neuron",
            AccessGate::Payment(_) => "payment",
            AccessGate::TokenBalance(_) => "token_balance",
            AccessGate::Composite(_) => "composite",
            AccessGate::Locked => "locked",
            AccessGate::ReferredByMember => "referred_by_member",
        }
    }
}

#[ts_export]
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub struct VerifiedCredentialGate {
    pub issuer_canister_id: CanisterId,
    pub issuer_origin: String,
    pub credential_type: String,
    pub credential_name: String,
    pub credential_arguments: HashMap<String, VerifiedCredentialArgumentValue>,
}

#[ts_export]
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub enum VerifiedCredentialArgumentValue {
    String(String),
    Int(i32),
}

#[ts_export]
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub struct SnsNeuronGate {
    pub governance_canister_id: CanisterId,
    pub min_stake_e8s: Option<u64>,
    pub min_dissolve_delay: Option<Milliseconds>,
}

#[ts_export]
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub struct PaymentGate {
    pub ledger_canister_id: CanisterId,
    pub amount: u128,
    pub fee: u128,
}

#[ts_export]
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub struct TokenBalanceGate {
    pub ledger_canister_id: CanisterId,
    pub min_balance: u128,
}

#[ts_export]
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub struct CompositeGate {
    pub inner: Vec<AccessGateNonComposite>,
    pub and: bool,
}

#[ts_export]
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum GateCheckFailedReason {
    NotDiamondMember,
    NotLifetimeDiamondMember,
    NoUniquePersonProof,
    NoSnsNeuronsFound,
    NoSnsNeuronsWithRequiredStakeFound,
    NoSnsNeuronsWithRequiredDissolveDelayFound,
    PaymentFailed(TransferFromError),
    InsufficientBalance(u128),
    FailedVerifiedCredentialCheck(String),
    Locked,
    NotReferredByMember,
    Unknown,
}

#[ts_export]
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct VerifiedCredentialGateArgs {
    pub user_ii_principal: Principal,
    pub credential_jwt: String,
    #[serde(default)]
    pub credential_jwts: Vec<String>,
    pub ii_origin: String,
}

impl VerifiedCredentialGateArgs {
    pub fn credential_jwts(&self) -> Vec<String> {
        let mut credential_jwts = self.credential_jwts.clone();
        if !self.credential_jwt.is_empty() && !credential_jwts.contains(&self.credential_jwt) {
            credential_jwts.push(self.credential_jwt.clone());
        }
        credential_jwts
    }
}
