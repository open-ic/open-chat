use crate::queries::check_replica_up_to_date;
use crate::{read_state, RuntimeState};
use canister_api_macros::query;
use group_canister::messages_by_message_index::{Response::*, *};
use group_chat_core::MessagesResult;

#[query(candid = true, msgpack = true)]
fn messages_by_message_index(args: Args) -> Response {
    read_state(|state| messages_by_message_index_impl(args, state))
}

fn messages_by_message_index_impl(args: Args, state: &RuntimeState) -> Response {
    if let Err(now) = check_replica_up_to_date(args.latest_known_update, state) {
        return ReplicaNotUpToDateV2(now);
    }

    let caller = state.env.caller();
    let user_id = state.data.lookup_user_id(caller);

    match state
        .data
        .chat
        .messages_by_message_index(user_id, args.thread_root_message_index, args.messages)
    {
        MessagesResult::Success(response) => Success(response),
        MessagesResult::UserNotInGroup => CallerNotInGroup,
        MessagesResult::ThreadNotFound => ThreadMessageNotFound,
    }
}
