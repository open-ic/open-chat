pub mod icrc1;
pub mod nns;

use candid::{CandidType, Principal};
use ic_ledger_types::{AccountIdentifier, Memo, Subaccount, Timestamp, Tokens, TransferArgs, DEFAULT_SUBACCOUNT};
use serde::{Deserialize, Serialize};
use sha256::sha256;
use types::icrc1::Account;
use types::{
    nns::UserOrAccount, CanisterId, CompletedCryptoTransaction, Cryptocurrency, FailedCryptoTransaction,
    PendingCryptoTransaction, TimestampNanos, TransactionHash, UserId,
};

pub fn create_pending_transaction(
    token: Cryptocurrency,
    ledger: CanisterId,
    amount: u128,
    fee: u128,
    user_id: UserId,
    now_nanos: TimestampNanos,
) -> PendingCryptoTransaction {
    match token {
        Cryptocurrency::InternetComputer => PendingCryptoTransaction::NNS(types::nns::PendingCryptoTransaction {
            ledger,
            token,
            amount: Tokens::from_e8s(amount as u64),
            to: UserOrAccount::User(user_id),
            fee: None,
            memo: None,
            created: now_nanos,
        }),
        _ => PendingCryptoTransaction::ICRC1(types::icrc1::PendingCryptoTransaction {
            ledger,
            fee,
            token,
            amount,
            to: Account::from(Principal::from(user_id)),
            memo: None,
            created: now_nanos,
        }),
    }
}

pub async fn process_transaction(
    transaction: PendingCryptoTransaction,
    sender: CanisterId,
) -> Result<CompletedCryptoTransaction, FailedCryptoTransaction> {
    match transaction {
        PendingCryptoTransaction::NNS(t) => nns::process_transaction(t, sender).await,
        PendingCryptoTransaction::ICRC1(t) => icrc1::process_transaction(t, sender).await,
    }
}

pub fn default_ledger_account(principal: Principal) -> AccountIdentifier {
    AccountIdentifier::new(&principal, &DEFAULT_SUBACCOUNT)
}

pub fn convert_to_subaccount(principal: &Principal) -> Subaccount {
    let mut subaccount = [0; std::mem::size_of::<Subaccount>()];
    let bytes = principal.as_slice();
    subaccount[0] = bytes.len().try_into().unwrap();
    subaccount[1..1 + bytes.len()].copy_from_slice(bytes);
    Subaccount(subaccount)
}

pub fn calculate_transaction_hash(sender: CanisterId, args: &TransferArgs) -> TransactionHash {
    let from = default_ledger_account(sender);

    let transaction = Transaction {
        operation: Operation::Transfer {
            from: from.to_string(),
            to: args.to.to_string(),
            amount: args.amount,
            fee: args.fee,
        },
        memo: args.memo,
        // 'args.created_at_time' must be set otherwise the hash won't match
        created_at_time: args.created_at_time.unwrap(),
    };

    transaction.hash()
}

pub fn format_crypto_amount(units: u128, decimals: u8) -> String {
    let subdividable_by = 10u128.pow(decimals as u32);

    format!("{}.{:0}", units / subdividable_by, units % subdividable_by)
        .trim_end_matches("0")
        .to_string()
}

/// An operation which modifies account balances
#[derive(Serialize, Deserialize, CandidType, Clone, Hash, Debug, PartialEq, Eq, PartialOrd, Ord)]
enum Operation {
    Burn {
        from: String,
        amount: Tokens,
    },
    Mint {
        to: String,
        amount: Tokens,
    },
    Transfer {
        from: String,
        to: String,
        amount: Tokens,
        fee: Tokens,
    },
}

/// An operation with the metadata the client generated attached to it
#[derive(Serialize, Deserialize, CandidType, Clone, Hash, Debug, PartialEq, Eq, PartialOrd, Ord)]
struct Transaction {
    pub operation: Operation,
    pub memo: Memo,

    /// The time this transaction was created.
    pub created_at_time: Timestamp,
}

impl Transaction {
    pub fn hash(&self) -> TransactionHash {
        let bytes = serde_cbor::ser::to_vec_packed(&self).unwrap();
        sha256(&bytes)
    }
}
