use crate::{read_state, RuntimeState};
use group_canister::deleted_message::{Response::*, *};
use ic_cdk_macros::query;

#[query]
fn deleted_message(args: Args) -> Response {
    read_state(|state| deleted_message_impl(args, state))
}

fn deleted_message_impl(args: Args, runtime_state: &RuntimeState) -> Response {
    let caller = runtime_state.env.caller();
    let participant = match runtime_state.data.participants.get(caller) {
        None => return CallerNotInGroup,
        Some(p) => p,
    };

    if !participant.role.can_delete_messages(&runtime_state.data.permissions) {
        return NotAuthorized;
    }

    if let Some(min_visible_event_index) = runtime_state.data.min_visible_event_index(caller, None) {
        if let Some((chat_events, min_visible_event_index)) = runtime_state
            .data
            .events
            .get_with_min_visible_event_index(args.thread_root_message_index, min_visible_event_index)
        {
            if let Some(event_index) = chat_events.event_index_by_message_id(args.message_id) {
                if event_index < min_visible_event_index {
                    return NotAuthorized;
                } else if let Some(message) = chat_events.message_internal_by_event_index(event_index) {
                    return Success(SuccessResult {
                        content: message.content.hydrate(Some(participant.user_id)),
                    });
                }
            }
        }

        MessageNotFound
    } else {
        NotAuthorized
    }
}
