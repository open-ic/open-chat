use crate::nns::{Tokens, UserOrAccount};
use crate::{CanisterId, TimestampNanos, UserId};
use candid::{CandidType, Principal};
use ic_ledger_types::{AccountIdentifier, Subaccount};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

const ICP_FEE: u128 = 10_000;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, Eq, PartialEq, Hash, TS)]
#[ts(export)]
pub enum Cryptocurrency {
    InternetComputer,
    SNS1,
    CKBTC,
    CHAT,
    KINIC,
    Other(String),
}

impl Cryptocurrency {
    pub fn token_symbol(&self) -> &str {
        match self {
            Cryptocurrency::InternetComputer => "ICP",
            Cryptocurrency::SNS1 => "SNS1",
            Cryptocurrency::CKBTC => "ckBTC",
            Cryptocurrency::CHAT => "CHAT",
            Cryptocurrency::KINIC => "KINIC",
            Cryptocurrency::Other(symbol) => symbol,
        }
    }

    pub fn decimals(&self) -> Option<u8> {
        match self {
            Cryptocurrency::InternetComputer => Some(8),
            Cryptocurrency::SNS1 => Some(8),
            Cryptocurrency::CKBTC => Some(8),
            Cryptocurrency::CHAT => Some(8),
            Cryptocurrency::KINIC => Some(8),
            Cryptocurrency::Other(_) => None,
        }
    }

    pub fn fee(&self) -> Option<u128> {
        match self {
            Cryptocurrency::InternetComputer => Some(ICP_FEE),
            Cryptocurrency::SNS1 => Some(1_000),
            Cryptocurrency::CKBTC => Some(10),
            Cryptocurrency::CHAT => Some(100_000),
            Cryptocurrency::KINIC => Some(100_000),
            Cryptocurrency::Other(_) => None,
        }
    }

    pub fn ledger_canister_id(&self) -> Option<CanisterId> {
        match self {
            Cryptocurrency::InternetComputer => Some(Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap()),
            Cryptocurrency::SNS1 => Some(Principal::from_text("zfcdd-tqaaa-aaaaq-aaaga-cai").unwrap()),
            Cryptocurrency::CKBTC => Some(Principal::from_text("mxzaz-hqaaa-aaaar-qaada-cai").unwrap()),
            Cryptocurrency::CHAT => Some(Principal::from_text("2ouva-viaaa-aaaaq-aaamq-cai").unwrap()),
            Cryptocurrency::KINIC => Some(Principal::from_text("73mez-iiaaa-aaaaq-aaasq-cai").unwrap()),
            Cryptocurrency::Other(_) => None,
        }
    }
}

pub type TransactionHash = [u8; 32];

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
pub enum CryptoTransaction {
    Pending(PendingCryptoTransaction),
    Completed(CompletedCryptoTransaction),
    Failed(FailedCryptoTransaction),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
pub enum PendingCryptoTransaction {
    NNS(nns::PendingCryptoTransaction),
    ICRC1(icrc1::PendingCryptoTransaction),
    ICRC2(icrc2::PendingCryptoTransaction),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
pub enum CompletedCryptoTransaction {
    NNS(nns::CompletedCryptoTransaction),
    ICRC1(icrc1::CompletedCryptoTransaction),
    ICRC2(icrc2::CompletedCryptoTransaction),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
pub enum FailedCryptoTransaction {
    NNS(nns::FailedCryptoTransaction),
    ICRC1(icrc1::FailedCryptoTransaction),
    ICRC2(icrc2::FailedCryptoTransaction),
}

impl CryptoTransaction {
    pub fn ledger_canister_id(&self) -> CanisterId {
        match self {
            CryptoTransaction::Pending(p) => p.ledger_canister_id(),
            CryptoTransaction::Completed(c) => c.ledger_canister_id(),
            CryptoTransaction::Failed(f) => f.ledger_canister_id(),
        }
    }

    pub fn token(&self) -> Cryptocurrency {
        match self {
            CryptoTransaction::Pending(p) => p.token(),
            CryptoTransaction::Completed(c) => c.token(),
            CryptoTransaction::Failed(f) => f.token(),
        }
    }

    pub fn is_zero(&self) -> bool {
        self.units() == 0
    }

    pub fn units(&self) -> u128 {
        match self {
            CryptoTransaction::Pending(p) => p.units(),
            CryptoTransaction::Completed(c) => c.units(),
            CryptoTransaction::Failed(f) => f.units(),
        }
    }

    pub fn fee(&self) -> u128 {
        match self {
            CryptoTransaction::Pending(p) => p.fee(),
            CryptoTransaction::Completed(c) => c.fee(),
            CryptoTransaction::Failed(f) => f.fee(),
        }
    }
}

impl PendingCryptoTransaction {
    pub fn ledger_canister_id(&self) -> CanisterId {
        match self {
            PendingCryptoTransaction::NNS(t) => t.ledger,
            PendingCryptoTransaction::ICRC1(t) => t.ledger,
            PendingCryptoTransaction::ICRC2(t) => t.ledger,
        }
    }

    pub fn token(&self) -> Cryptocurrency {
        match self {
            PendingCryptoTransaction::NNS(t) => t.token.clone(),
            PendingCryptoTransaction::ICRC1(t) => t.token.clone(),
            PendingCryptoTransaction::ICRC2(t) => t.token.clone(),
        }
    }

    pub fn is_zero(&self) -> bool {
        self.units() == 0
    }

    pub fn units(&self) -> u128 {
        match self {
            PendingCryptoTransaction::NNS(t) => t.amount.e8s().into(),
            PendingCryptoTransaction::ICRC1(t) => t.amount,
            PendingCryptoTransaction::ICRC2(t) => t.amount,
        }
    }

    pub fn fee(&self) -> u128 {
        match self {
            PendingCryptoTransaction::NNS(_) => ICP_FEE,
            PendingCryptoTransaction::ICRC1(t) => t.fee,
            PendingCryptoTransaction::ICRC2(t) => t.fee,
        }
    }

    pub fn user_id(&self) -> Option<UserId> {
        match self {
            PendingCryptoTransaction::NNS(t) => {
                if let UserOrAccount::User(u) = t.to {
                    Some(u)
                } else {
                    None
                }
            }
            PendingCryptoTransaction::ICRC1(t) => {
                if t.to.subaccount.unwrap_or_default() == [0; 32] {
                    Some(t.to.owner.into())
                } else {
                    None
                }
            }
            PendingCryptoTransaction::ICRC2(t) => {
                if t.to.subaccount.unwrap_or_default() == ic_ledger_types::DEFAULT_SUBACCOUNT.0 {
                    Some(t.to.owner.into())
                } else {
                    None
                }
            }
        }
    }

    pub fn validate_recipient(&self, recipient: UserId) -> bool {
        match self {
            PendingCryptoTransaction::NNS(t) => match t.to {
                UserOrAccount::Account(a) => {
                    a == AccountIdentifier::new(&recipient.into(), &ic_ledger_types::DEFAULT_SUBACCOUNT)
                }
                UserOrAccount::User(u) => u == recipient,
            },
            PendingCryptoTransaction::ICRC1(t) => t.to.owner == recipient.into(),
            PendingCryptoTransaction::ICRC2(t) => t.to.owner == recipient.into(),
        }
    }

    pub fn set_recipient(&mut self, owner: Principal, subaccount: Subaccount) {
        match self {
            PendingCryptoTransaction::NNS(t) => t.to = UserOrAccount::Account(AccountIdentifier::new(&owner, &subaccount)),
            PendingCryptoTransaction::ICRC1(t) => {
                t.to.owner = owner;
                t.to.subaccount = Some(subaccount.0)
            }
            PendingCryptoTransaction::ICRC2(t) => {
                t.to.owner = owner;
                t.to.subaccount = Some(subaccount.0)
            }
        }
    }

    pub fn created(&self) -> TimestampNanos {
        match self {
            PendingCryptoTransaction::NNS(t) => t.created,
            PendingCryptoTransaction::ICRC1(t) => t.created,
            PendingCryptoTransaction::ICRC2(t) => t.created,
        }
    }

    pub fn set_created(&mut self, created: TimestampNanos) {
        match self {
            PendingCryptoTransaction::NNS(t) => t.created = created,
            PendingCryptoTransaction::ICRC1(t) => t.created = created,
            PendingCryptoTransaction::ICRC2(t) => t.created = created,
        }
    }

    pub fn set_memo(mut self, memo: &[u8]) -> Self {
        match &mut self {
            PendingCryptoTransaction::NNS(t) => {
                t.memo = Some(ic_ledger_types::Memo(u64_from_bytes(memo)));
            }
            PendingCryptoTransaction::ICRC1(t) => {
                assert!(memo.len() <= 32);
                t.memo = Some(memo.to_vec().into());
            }
            PendingCryptoTransaction::ICRC2(t) => {
                assert!(memo.len() <= 32);
                t.memo = Some(memo.to_vec().into());
            }
        }
        self
    }
}

impl CompletedCryptoTransaction {
    pub fn ledger_canister_id(&self) -> CanisterId {
        match self {
            CompletedCryptoTransaction::NNS(t) => t.ledger,
            CompletedCryptoTransaction::ICRC1(t) => t.ledger,
            CompletedCryptoTransaction::ICRC2(t) => t.ledger,
        }
    }

    pub fn token(&self) -> Cryptocurrency {
        match self {
            CompletedCryptoTransaction::NNS(t) => t.token.clone(),
            CompletedCryptoTransaction::ICRC1(t) => t.token.clone(),
            CompletedCryptoTransaction::ICRC2(t) => t.token.clone(),
        }
    }

    pub fn units(&self) -> u128 {
        match self {
            CompletedCryptoTransaction::NNS(t) => t.amount.e8s().into(),
            CompletedCryptoTransaction::ICRC1(t) => t.amount,
            CompletedCryptoTransaction::ICRC2(t) => t.amount,
        }
    }

    pub fn fee(&self) -> u128 {
        match self {
            CompletedCryptoTransaction::NNS(_) => ICP_FEE,
            CompletedCryptoTransaction::ICRC1(t) => t.fee,
            CompletedCryptoTransaction::ICRC2(t) => t.fee,
        }
    }

    pub fn index(&self) -> u64 {
        match self {
            CompletedCryptoTransaction::NNS(t) => t.block_index,
            CompletedCryptoTransaction::ICRC1(t) => t.block_index,
            CompletedCryptoTransaction::ICRC2(t) => t.block_index,
        }
    }
}

impl FailedCryptoTransaction {
    pub fn ledger_canister_id(&self) -> CanisterId {
        match self {
            FailedCryptoTransaction::NNS(t) => t.ledger,
            FailedCryptoTransaction::ICRC1(t) => t.ledger,
            FailedCryptoTransaction::ICRC2(t) => t.ledger,
        }
    }

    pub fn token(&self) -> Cryptocurrency {
        match self {
            FailedCryptoTransaction::NNS(t) => t.token.clone(),
            FailedCryptoTransaction::ICRC1(t) => t.token.clone(),
            FailedCryptoTransaction::ICRC2(t) => t.token.clone(),
        }
    }

    pub fn error_message(&self) -> &str {
        match self {
            FailedCryptoTransaction::NNS(t) => &t.error_message,
            FailedCryptoTransaction::ICRC1(t) => &t.error_message,
            FailedCryptoTransaction::ICRC2(t) => &t.error_message,
        }
    }

    pub fn units(&self) -> u128 {
        match self {
            FailedCryptoTransaction::NNS(t) => t.amount.e8s().into(),
            FailedCryptoTransaction::ICRC1(t) => t.amount,
            FailedCryptoTransaction::ICRC2(t) => t.amount,
        }
    }

    pub fn fee(&self) -> u128 {
        match self {
            FailedCryptoTransaction::NNS(_) => ICP_FEE,
            FailedCryptoTransaction::ICRC1(t) => t.fee,
            FailedCryptoTransaction::ICRC2(t) => t.fee,
        }
    }
}

pub mod nns {
    use super::*;
    use ic_ledger_types::{AccountIdentifier, BlockIndex, Memo};

    #[derive(CandidType, Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, TS)]
    pub struct Tokens {
        e8s: u64,
    }

    impl Tokens {
        pub const fn from_e8s(e8s: u64) -> Self {
            Self { e8s }
        }

        pub const fn e8s(&self) -> u64 {
            self.e8s
        }

        pub const DEFAULT_FEE: Tokens = Tokens { e8s: 10_000 };
    }

    impl From<Tokens> for ic_ledger_types::Tokens {
        fn from(value: Tokens) -> Self {
            ic_ledger_types::Tokens::from_e8s(value.e8s)
        }
    }

    impl From<ic_ledger_types::Tokens> for Tokens {
        fn from(value: ic_ledger_types::Tokens) -> Self {
            Tokens::from_e8s(value.e8s())
        }
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub struct Account {
        pub owner: Principal,
        #[ts(as = "[u8; 32]")]
        pub subaccount: Option<Subaccount>,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub struct CryptoAmount {
        pub token: Cryptocurrency,
        pub amount: Tokens,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub enum CryptoAccount {
        Mint,
        Account(#[ts(as = "String")] AccountIdentifier),
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub enum UserOrAccount {
        User(UserId),
        Account(#[ts(as = "String")] AccountIdentifier),
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub struct PendingCryptoTransaction {
        pub ledger: CanisterId,
        pub token: Cryptocurrency,
        pub amount: Tokens,
        pub to: UserOrAccount,
        pub fee: Option<Tokens>,
        #[ts(as = "u64")]
        pub memo: Option<Memo>,
        pub created: TimestampNanos,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub struct CompletedCryptoTransaction {
        pub ledger: CanisterId,
        pub token: Cryptocurrency,
        pub amount: Tokens,
        pub fee: Tokens,
        pub from: CryptoAccount,
        pub to: CryptoAccount,
        #[ts(as = "u64")]
        pub memo: Memo,
        pub created: TimestampNanos,
        #[serde(default)]
        pub transaction_hash: TransactionHash,
        pub block_index: BlockIndex,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub struct FailedCryptoTransaction {
        pub ledger: CanisterId,
        pub token: Cryptocurrency,
        pub amount: Tokens,
        pub fee: Tokens,
        pub from: CryptoAccount,
        pub to: CryptoAccount,
        #[ts(as = "u64")]
        pub memo: Memo,
        pub created: TimestampNanos,
        #[serde(default)]
        pub transaction_hash: TransactionHash,
        pub error_message: String,
    }
}

pub mod icrc1 {
    use super::*;
    use icrc_ledger_types::icrc1::transfer::Memo;

    #[derive(Serialize, CandidType, Deserialize, Clone, Debug, Copy, TS)]
    pub struct Account {
        pub owner: Principal,
        pub subaccount: Option<[u8; 32]>,
    }

    impl From<Principal> for Account {
        fn from(value: Principal) -> Self {
            Account {
                owner: value,
                subaccount: None,
            }
        }
    }

    impl From<Account> for icrc_ledger_types::icrc1::account::Account {
        fn from(value: Account) -> Self {
            icrc_ledger_types::icrc1::account::Account {
                owner: value.owner,
                subaccount: value.subaccount,
            }
        }
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub enum CryptoAccount {
        Mint,
        Account(Account),
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub struct PendingCryptoTransaction {
        #[ts(as = "String")]
        pub ledger: CanisterId,
        pub token: Cryptocurrency,
        pub amount: u128,
        pub to: Account,
        pub fee: u128,
        #[ts(as = "Option<Vec<u8>>")]
        pub memo: Option<Memo>,
        pub created: TimestampNanos,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub struct CompletedCryptoTransaction {
        pub ledger: CanisterId,
        pub token: Cryptocurrency,
        pub amount: u128,
        pub from: CryptoAccount,
        pub to: CryptoAccount,
        pub fee: u128,
        #[ts(as = "Option<Vec<u8>>")]
        pub memo: Option<Memo>,
        pub created: TimestampNanos,
        pub block_index: u64,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub struct FailedCryptoTransaction {
        pub ledger: CanisterId,
        pub token: Cryptocurrency,
        pub amount: u128,
        pub fee: u128,
        pub from: CryptoAccount,
        pub to: CryptoAccount,
        #[ts(as = "Option<Vec<u8>>")]
        pub memo: Option<Memo>,
        pub created: TimestampNanos,
        pub error_message: String,
    }

    impl From<CompletedCryptoTransaction> for super::CompletedCryptoTransaction {
        fn from(value: CompletedCryptoTransaction) -> Self {
            super::CompletedCryptoTransaction::ICRC1(value)
        }
    }

    impl From<FailedCryptoTransaction> for super::FailedCryptoTransaction {
        fn from(value: FailedCryptoTransaction) -> Self {
            super::FailedCryptoTransaction::ICRC1(value)
        }
    }

    impl From<Account> for CryptoAccount {
        fn from(value: Account) -> Self {
            CryptoAccount::Account(value)
        }
    }
}

pub mod icrc2 {
    use super::*;
    use icrc1::Account;
    use icrc_ledger_types::icrc1::transfer::Memo;

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub struct PendingCryptoTransaction {
        pub ledger: CanisterId,
        pub token: Cryptocurrency,
        pub amount: u128,
        pub from: Account,
        pub to: Account,
        pub fee: u128,
        #[ts(as = "Option<Vec<u8>>")]
        pub memo: Option<Memo>,
        pub created: TimestampNanos,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub struct CompletedCryptoTransaction {
        pub ledger: CanisterId,
        pub token: Cryptocurrency,
        pub amount: u128,
        pub spender: UserId,
        pub from: icrc1::CryptoAccount,
        pub to: icrc1::CryptoAccount,
        pub fee: u128,
        #[ts(as = "Option<Vec<u8>>")]
        pub memo: Option<Memo>,
        pub created: TimestampNanos,
        pub block_index: u64,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug, TS)]
    #[ts(export)]
    pub struct FailedCryptoTransaction {
        pub ledger: CanisterId,
        pub token: Cryptocurrency,
        pub amount: u128,
        pub fee: u128,
        pub spender: UserId,
        pub from: icrc1::CryptoAccount,
        pub to: icrc1::CryptoAccount,
        #[ts(as = "Option<Vec<u8>>")]
        pub memo: Option<Memo>,
        pub created: TimestampNanos,
        pub error_message: String,
    }

    impl From<CompletedCryptoTransaction> for super::CompletedCryptoTransaction {
        fn from(value: CompletedCryptoTransaction) -> Self {
            super::CompletedCryptoTransaction::ICRC2(value)
        }
    }

    impl From<FailedCryptoTransaction> for super::FailedCryptoTransaction {
        fn from(value: FailedCryptoTransaction) -> Self {
            super::FailedCryptoTransaction::ICRC2(value)
        }
    }
}

impl From<icrc1::PendingCryptoTransaction> for nns::PendingCryptoTransaction {
    fn from(value: icrc1::PendingCryptoTransaction) -> Self {
        nns::PendingCryptoTransaction {
            ledger: value.ledger,
            token: value.token,
            amount: Tokens::from_e8s(value.amount.try_into().unwrap()),
            to: UserOrAccount::Account(AccountIdentifier::new(
                &value.to.owner,
                &Subaccount(value.to.subaccount.unwrap_or_default()),
            )),
            fee: Some(Tokens::from_e8s(value.fee.try_into().unwrap())),
            memo: value.memo.map(|m| ic_ledger_types::Memo(u64_from_bytes(m.0.as_slice()))),
            created: value.created,
        }
    }
}

fn u64_from_bytes(bytes: &[u8]) -> u64 {
    assert!(bytes.len() <= 8);
    let mut u64_bytes = [0u8; 8];
    u64_bytes[(8 - bytes.len())..].copy_from_slice(bytes);
    u64::from_be_bytes(u64_bytes)
}
