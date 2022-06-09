use crate::crypto::process_transaction;
use crate::guards::caller_is_owner;
use crate::{read_state, run_regular_jobs, RuntimeState};
use canister_tracing_macros::trace;
use ic_cdk_macros::update;
use ic_ledger_types::Tokens;
use types::{
    CompletedCryptocurrencyTransfer, CryptoAccount, CryptoTransaction, CryptocurrencyContent, CryptocurrencyTransfer,
    MessageContent, PendingCryptoTransaction, MAX_TEXT_LENGTH, MAX_TEXT_LENGTH_USIZE,
};
use user_canister::transfer_cryptocurrency_within_group::{Response::*, *};

#[update(guard = "caller_is_owner")]
#[trace]
async fn transfer_cryptocurrency_within_group(args: Args) -> Response {
    run_regular_jobs();

    if let Err(response) = read_state(|state| validate_request(&args, state)) {
        return response;
    }

    let pending_transaction = match &args.content.transfer {
        CryptocurrencyTransfer::Pending(t) => PendingCryptoTransaction {
            token: t.token,
            amount: t.amount,
            to: CryptoAccount::User(t.recipient),
            fee: t.fee,
            memo: t.memo,
        },
        _ => return InvalidRequest("Transaction must be of type 'Pending'".to_string()),
    };

    let completed_transfer = match process_transaction(pending_transaction).await {
        Ok(completed) => completed,
        Err(failed) => return TransferFailed(failed.error_message),
    };

    let c2c_args = group_canister::send_message::Args {
        message_id: args.message_id,
        content: MessageContent::Cryptocurrency(CryptocurrencyContent {
            transfer: CryptoTransaction::Completed(completed_transfer.clone()),
            caption: args.content.caption,
        }),
        sender_name: args.sender_name,
        replies_to: args.replies_to,
        mentioned: args.mentioned,
        forwarding: false,
    };

    let old_format_transfer = CompletedCryptocurrencyTransfer {
        token: completed_transfer.token,
        sender: read_state(|state| state.env.canister_id().into()),
        recipient: args.recipient,
        amount: completed_transfer.amount,
        fee: completed_transfer.fee,
        memo: completed_transfer.memo,
        block_index: completed_transfer.block_index,
        transaction_hash: completed_transfer.transaction_hash,
    };

    match group_canister_c2c_client::send_message(args.group_id.into(), &c2c_args).await {
        Ok(response) => match response {
            group_canister::send_message::Response::Success(r) => Success(SuccessResult {
                event_index: r.event_index,
                message_index: r.message_index,
                timestamp: r.timestamp,
                transfer: old_format_transfer,
            }),
            group_canister::send_message::Response::CallerNotInGroup => CallerNotInGroup(Some(old_format_transfer)),
            group_canister::send_message::Response::MessageEmpty
            | group_canister::send_message::Response::InvalidPoll(_)
            | group_canister::send_message::Response::NotAuthorized
            | group_canister::send_message::Response::InvalidRequest(_)
            | group_canister::send_message::Response::TextTooLong(_) => unreachable!(),
        },
        Err(error) => InternalError(format!("{error:?}"), old_format_transfer),
    }
}

fn validate_request(args: &Args, runtime_state: &RuntimeState) -> Result<(), Response> {
    if runtime_state.data.blocked_users.contains(&args.recipient) {
        Err(RecipientBlocked)
    } else if runtime_state.data.group_chats.get(&args.group_id).is_none() {
        Err(CallerNotInGroup(None))
    } else if args.content.transfer.amount() == Tokens::ZERO {
        Err(TransferCannotBeZero)
    } else if let Err(limit) = args.content.within_limit() {
        Err(TransferLimitExceeded(limit))
    } else if args.content.caption.as_ref().map_or(0, |c| c.len()) > MAX_TEXT_LENGTH_USIZE {
        Err(TextTooLong(MAX_TEXT_LENGTH))
    } else {
        Ok(())
    }
}
