use crate::{read_state, RuntimeState};
use group_canister::events::{Response::*, *};
use ic_cdk_macros::query;

#[query]
fn events(args: Args) -> Response {
    read_state(|state| events_impl(args, state))
}

fn events_impl(args: Args, runtime_state: &RuntimeState) -> Response {
    let caller = runtime_state.env.caller();

    if let Some(participant) = runtime_state.data.participants.get(caller) {
        let min_visible_event_index = participant.min_visible_event_index();

        let events = runtime_state.data.events.from_index(
            args.start_index,
            args.ascending,
            args.max_messages as usize,
            args.max_events as usize,
            min_visible_event_index,
            Some(participant.user_id),
        );

        let affected_events = runtime_state.data.events.affected_events(&events, Some(participant.user_id));
        let latest_event_index = runtime_state.data.events.last().index;

        Success(SuccessResult {
            events,
            affected_events,
            latest_event_index,
        })
    } else {
        CallerNotInGroup
    }
}
