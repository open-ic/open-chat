use crate::guards::caller_is_push_service;
use crate::{read_state, RuntimeState};
use ic_cdk_macros::query;
use notifications_canister::notifications::{Response::*, *};
use std::collections::HashMap;
use types::{IndexedEvent, NotificationEnvelope, SubscriptionInfo, UserId};

const DEFAULT_MAX_RESULTS: u32 = 50;

#[query(guard = "caller_is_push_service")]
fn notifications(args: Args) -> Response {
    read_state(|state| notifications_impl(args, state))
}

fn notifications_impl(args: Args, state: &RuntimeState) -> Response {
    let notifications = state
        .data
        .notifications
        .get(args.from_notification_index, args.max_results.unwrap_or(DEFAULT_MAX_RESULTS));

    let result = add_subscriptions(notifications, state);
    Success(result)
}

fn add_subscriptions(notifications: Vec<IndexedEvent<NotificationEnvelope>>, state: &RuntimeState) -> SuccessResult {
    let mut active_notifications: Vec<IndexedEvent<NotificationEnvelope>> = Vec::new();
    let mut subscriptions: HashMap<UserId, Vec<SubscriptionInfo>> = HashMap::new();

    for n in notifications {
        let mut has_subscriptions = false;

        for u in n.value.recipients.iter() {
            if let Some(s) = state.data.subscriptions.get(u) {
                subscriptions.insert(*u, s);
                has_subscriptions = true;
            }
        }

        if has_subscriptions {
            active_notifications.push(n);
        }
    }

    SuccessResult {
        notifications: active_notifications,
        subscriptions,
        timestamp: state.env.now(),
    }
}
