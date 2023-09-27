use crate::{read_state, RuntimeState};
use canister_api_macros::query_msgpack;
use group_canister::summary_updates::{Response::*, *};
use ic_cdk_macros::query;
use std::cmp::max;
use types::{GroupCanisterGroupChatSummaryUpdates, OptionUpdate, RangeSet, MAX_THREADS_IN_SUMMARY};

#[query]
fn summary_updates(args: Args) -> Response {
    read_state(|state| summary_updates_impl(args, state))
}

#[query_msgpack]
fn c2c_summary_updates(args: Args) -> Response {
    read_state(|state| summary_updates_impl(args, state))
}

fn summary_updates_impl(args: Args, state: &RuntimeState) -> Response {
    let caller = state.env.caller();
    let member = match state.data.get_member(caller) {
        None => return CallerNotInGroup,
        Some(p) => p,
    };
    let updates_since = max(args.updates_since, member.date_added);

    let chat = &state.data.chat;

    // Short circuit prior to calling `ic0.time()` so that query caching works effectively.
    // This doesn't account for expired events, but they aren't used yet and should probably just be
    // handled by the FE anyway.
    if !chat.has_updates_since(Some(member.user_id), updates_since) {
        return SuccessNoUpdates;
    }

    let now = state.env.now();
    let updates_from_events = chat.summary_updates_from_events(updates_since, Some(member.user_id));

    let updates = GroupCanisterGroupChatSummaryUpdates {
        chat_id: state.env.canister_id().into(),
        last_updated: now,
        name: updates_from_events.name,
        description: updates_from_events.description,
        subtype: updates_from_events.subtype,
        avatar_id: updates_from_events.avatar_id,
        latest_message: updates_from_events.latest_message,
        latest_event_index: updates_from_events.latest_event_index,
        participant_count: updates_from_events.members_changed.then_some(chat.members.len()),
        role: updates_from_events.role_changed.then_some(member.role.into()),
        mentions: updates_from_events.mentions,
        permissions: updates_from_events.permissions,
        updated_events: updates_from_events.updated_events,
        metrics: Some(chat.events.metrics().hydrate()),
        my_metrics: state
            .data
            .chat
            .events
            .user_metrics(&member.user_id, Some(args.updates_since))
            .map(|m| m.hydrate()),
        is_public: updates_from_events.is_public,
        latest_threads: chat.events.latest_threads(
            member.min_visible_event_index(),
            member.threads.iter(),
            Some(args.updates_since),
            MAX_THREADS_IN_SUMMARY,
            member.user_id,
        ),
        unfollowed_threads: chat
            .events
            .unfollowed_threads(member.threads.iter(), args.updates_since, member.user_id),
        notifications_muted: member.notifications_muted.if_set_after(args.updates_since).cloned(),
        frozen: state
            .data
            .frozen
            .if_set_after(args.updates_since)
            .cloned()
            .map_or(OptionUpdate::NoChange, OptionUpdate::from_update),
        wasm_version: None,
        date_last_pinned: updates_from_events.date_last_pinned,
        events_ttl: updates_from_events.events_ttl,
        newly_expired_messages: RangeSet::default(),
        next_message_expiry: OptionUpdate::NoChange,
        gate: updates_from_events.gate,
        rules_accepted: member
            .rules_accepted
            .as_ref()
            .filter(|accepted| updates_from_events.rules_changed || accepted.timestamp > args.updates_since)
            .map(|accepted| accepted.value >= chat.rules.text.version),
    };
    Success(SuccessResult { updates })
}
