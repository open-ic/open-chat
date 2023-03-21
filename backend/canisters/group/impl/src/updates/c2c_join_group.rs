use crate::activity_notifications::handle_activity_notification;
use crate::guards::caller_is_local_user_index;
use crate::model::participants::AddResult;
use crate::{mutate_state, run_regular_jobs, AddParticipantArgs, RuntimeState};
use canister_api_macros::update_msgpack;
use canister_tracing_macros::trace;
use chat_events::ChatEventInternal;
use group_canister::c2c_join_group::{Response::*, *};
use types::{EventIndex, MessageIndex, ParticipantJoined, UsersUnblocked};

#[update_msgpack(guard = "caller_is_local_user_index")]
#[trace]
fn c2c_join_group(args: Args) -> Response {
    run_regular_jobs();

    mutate_state(|state| c2c_join_group_impl(args, state))
}

fn c2c_join_group_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    if runtime_state.data.is_frozen() {
        ChatFrozen
    } else if runtime_state.data.is_accessible_by_non_member(args.invite_code) {
        if let Some(limit) = runtime_state.data.participants.user_limit_reached() {
            return ParticipantLimitReached(limit);
        }

        let now = runtime_state.env.now();
        let min_visible_event_index;
        let min_visible_message_index;
        if runtime_state.data.history_visible_to_new_joiners {
            min_visible_event_index = EventIndex::default();
            min_visible_message_index = MessageIndex::default();
        } else {
            let events_reader = runtime_state.data.events.main_events_reader(now);
            min_visible_event_index = events_reader.next_event_index();
            min_visible_message_index = events_reader.next_message_index();
        };

        // Unblock "platform moderator" if necessary
        let mut new_event = false;
        if args.is_platform_moderator && runtime_state.data.participants.is_blocked(&args.user_id) {
            runtime_state.data.participants.unblock(&args.user_id);

            let event = UsersUnblocked {
                user_ids: vec![args.user_id],
                unblocked_by: args.user_id,
            };

            runtime_state.data.events.push_main_event(
                ChatEventInternal::UsersUnblocked(Box::new(event)),
                args.correlation_id,
                now,
            );

            new_event = true;
        }

        let response = match runtime_state.add_participant(AddParticipantArgs {
            user_id: args.user_id,
            principal: args.principal,
            now,
            min_visible_event_index,
            min_visible_message_index,
            mute_notifications: runtime_state.data.is_public,
        }) {
            AddResult::Success(participant) => {
                let event = ParticipantJoined { user_id: args.user_id };
                runtime_state.data.events.push_main_event(
                    ChatEventInternal::ParticipantJoined(Box::new(event)),
                    args.correlation_id,
                    now,
                );

                new_event = true;

                let summary = runtime_state.summary(&participant, now);
                Success(Box::new(summary))
            }
            AddResult::AlreadyInGroup => {
                let participant = runtime_state.data.participants.get_by_principal(&args.principal).unwrap();
                let summary = runtime_state.summary(participant, now);
                AlreadyInGroupV2(Box::new(summary))
            }
            AddResult::Blocked => Blocked,
        };

        if new_event {
            handle_activity_notification(runtime_state);
        }

        response

    } else {
        GroupNotPublic
    }
}
