use crate::updates::handle_activity_notification;
use crate::{run_regular_jobs, RuntimeState, RUNTIME_STATE};
use candid::Principal;
use canister_api_macros::trace;
use chat_events::PushMessageArgs;
use group_canister::send_message::{Response::*, *};
use lazy_static::lazy_static;
use ic_cdk_macros::update;
use notifications_canister::push_group_message_notification;
use regex::Regex;
use types::{CanisterId, GroupMessageNotification, MessageContent, UserId};
use utils::rand::get_random_item;

#[update]
#[trace]
fn send_message(args: Args) -> Response {
    run_regular_jobs();

    RUNTIME_STATE.with(|state| send_message_impl(args, state.borrow_mut().as_mut().unwrap()))
}

fn send_message_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let caller = runtime_state.env.caller();
    if let Some(participant) = runtime_state.data.participants.get_by_principal_mut(&caller) {
        let now = runtime_state.env.now();
        let sender = participant.user_id;
        let mentioned_users = extract_mentioned_users(&args.content);

        let push_message_args = PushMessageArgs {
            sender,
            message_id: args.message_id,
            content: args.content,
            replies_to: args.replies_to.map(|r| r.into()),
            now,
        };

        let (event_index, message) = runtime_state.data.events.push_message(push_message_args);

        let mentioned_participants: Vec<_> = mentioned_users
            .iter()
            .filter_map(
                |u| {
                    if runtime_state.data.participants.add_mention(u, event_index) {
                        Some(*u)
                    } else {
                        None
                    }
                },
            )
            .collect();

        handle_activity_notification(runtime_state);

        let random = runtime_state.env.random_u32() as usize;
        let message_index = message.message_index;

        if let Some(canister_id) = get_random_item(&runtime_state.data.notification_canister_ids, random) {
            let notification = GroupMessageNotification {
                chat_id: runtime_state.env.canister_id().into(),
                group_name: runtime_state.data.name.clone(),
                sender,
                sender_name: args.sender_name,
                message,
            };
            let mut recipients = runtime_state.data.participants.users_to_notify(sender);
            recipients.extend(mentioned_participants.into_iter());

            ic_cdk::block_on(push_notification(
                *canister_id,
                recipients.into_iter().collect(),
                notification,
            ));
        }

        Success(SuccessResult {
            event_index,
            message_index,
            timestamp: now,
        })
    } else {
        CallerNotInGroup
    }
}

async fn push_notification(canister_id: CanisterId, recipients: Vec<UserId>, notification: GroupMessageNotification) {
    let args = push_group_message_notification::Args {
        recipients,
        notification,
    };
    let _ = notifications_canister_c2c_client::push_group_message_notification(canister_id, &args).await;
}

fn extract_mentioned_users(content: &MessageContent) -> Vec<UserId> {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"@UserId\(([^\)]*)\)").unwrap();
    }

    let text = match content {
        MessageContent::Text(m) => Some(&m.text),
        MessageContent::Image(m) => m.caption.as_ref(),
        MessageContent::Video(m) => m.caption.as_ref(),
        MessageContent::Audio(m) => m.caption.as_ref(),
        MessageContent::File(m) => m.caption.as_ref(),
        MessageContent::Cryptocurrency(m) => m.caption.as_ref(),
        _ => None
    };

    if let Some(text) = text {
        RE.captures_iter(text)
            .filter_map(|cap| Principal::from_text(&cap[1]).ok())
            .map(|p| p.into())
            .collect()
    } else {
        Vec::new()
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use types::TextContent;

    #[test]
    fn text_extract_mentioned_users() {
        let message = "Hey @UserId(qoctq-giaaa-aaaaa-aaaea-cai), \n@UserId(renrk-eyaaa-aaaaa-aaada-cai), check this out";
        let content = MessageContent::Text(TextContent { text: message.to_owned() });
        let users = extract_mentioned_users(&content);

        assert_eq!(2, users.len());
        assert_eq!("qoctq-giaaa-aaaaa-aaaea-cai".to_owned(), users[0].to_string());
        assert_eq!("renrk-eyaaa-aaaaa-aaada-cai".to_owned(), users[1].to_string());
    }
}