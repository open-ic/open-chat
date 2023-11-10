use crate::{read_state, RuntimeState};
use group_canister::messages_by_message_index::{Response::*, *};
use group_chat_core::MessagesResult;
use ic_cdk_macros::query;

#[query]
fn messages_by_message_index(args: Args) -> Response {
    read_state(|state| messages_by_message_index_impl(args, state))
}

fn messages_by_message_index_impl(args: Args, state: &RuntimeState) -> Response {
    let caller = state.env.caller();
    let user_id = state.data.lookup_user_id(caller);

    match state.data.chat.messages_by_message_index(
        user_id,
        args.thread_root_message_index,
        args.messages,
        args.latest_known_update,
    ) {
        MessagesResult::Success(response) => Success(response),
        MessagesResult::UserNotInGroup => CallerNotInGroup,
        MessagesResult::ThreadNotFound => ThreadMessageNotFound,
        MessagesResult::ReplicaNotUpToDate(last_updated) => ReplicaNotUpToDateV2(last_updated),
    }
}
