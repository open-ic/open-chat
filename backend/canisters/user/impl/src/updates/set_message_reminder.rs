use crate::guards::caller_is_owner;
use crate::timer_job_types::{MessageReminderJob, TimerJob};
use crate::{mutate_state, openchat_bot, run_regular_jobs, RuntimeState};
use canister_api_macros::update;
use canister_tracing_macros::trace;
use chat_events::{MessageContentInternal, MessageReminderCreatedContentInternal};
use rand::RngCore;
use types::{Achievement, FieldTooLongResult};
use user_canister::set_message_reminder_v2::{Response::*, *};
use user_canister::C2CReplyContext;

const MAX_NOTES_LENGTH: usize = 1000;

#[update(guard = "caller_is_owner", msgpack = true)]
#[trace]
fn set_message_reminder_v2(args: Args) -> Response {
    run_regular_jobs();

    mutate_state(|state| set_message_reminder_impl(args, state))
}

fn set_message_reminder_impl(args: Args, state: &mut RuntimeState) -> Response {
    if state.data.suspended.value {
        return UserSuspended;
    }

    let now = state.env.now();
    if args.remind_at <= now {
        return ReminderDateInThePast;
    }

    let notes_len = args.notes.as_ref().map(|n| n.chars().count()).unwrap_or_default();
    if notes_len > MAX_NOTES_LENGTH {
        return NotesTooLong(FieldTooLongResult {
            length_provided: notes_len as u32,
            max_length: MAX_NOTES_LENGTH as u32,
        });
    }

    let reminder_id = state.env.rng().next_u64();

    let reminder_created_message_index = openchat_bot::send_message_with_reply(
        MessageContentInternal::MessageReminderCreated(MessageReminderCreatedContentInternal {
            reminder_id,
            remind_at: args.remind_at,
            notes: args.notes.clone(),
            hidden: false,
        }),
        Some(C2CReplyContext::OtherChat(
            args.chat,
            args.thread_root_message_index,
            args.event_index,
        )),
        Vec::new(),
        true,
        state,
    )
    .event
    .message_index;

    state.data.timer_jobs.enqueue_job(
        TimerJob::MessageReminder(Box::new(MessageReminderJob {
            reminder_id,
            chat: args.chat,
            thread_root_message_index: args.thread_root_message_index,
            event_index: args.event_index,
            notes: args.notes,
            reminder_created_message_index,
        })),
        args.remind_at,
        now,
    );

    state.data.award_achievement_and_notify(Achievement::SentReminder, now);

    Success(reminder_id)
}
