use crate::error::Error;
use crate::ic_agent::IcAgent;
use crate::ic_agent::IcAgentConfig;
use crate::store::Store;
use futures::future;
use log::error;
use std::collections::hash_map::Entry::{Occupied, Vacant};
use std::collections::HashMap;
use std::fs::File;
use types::{CanisterId, IndexedEvent, Notification, UserId};
use web_push::*;

pub async fn run(
    config: IcAgentConfig,
    canister_id: CanisterId,
    mut store: Box<dyn Store + Send + Sync>,
    vapid_private_pem: &str,
) -> Result<(), Error> {
    let ic_agent = IcAgent::build(config).await?;
    let from_notification_index = store
        .get_notification_index_processed_up_to(canister_id)
        .await?
        .map_or(0, |i| i + 1);

    let ic_response = ic_agent.get_notifications(canister_id, from_notification_index).await?;

    if let Some(latest_notification_index) = ic_response.notifications.last().map(|e| e.index) {
        let subscriptions_map = ic_response
            .subscriptions
            .into_iter()
            .map(|(k, v)| (k, v.into_iter().map(convert_subscription_info).collect()))
            .collect();

        let subscriptions_to_remove =
            handle_notifications(ic_response.notifications, subscriptions_map, vapid_private_pem).await;

        let future1 = store.set_notification_index_processed_up_to(canister_id, latest_notification_index);
        let future2 = ic_agent.remove_subscriptions(canister_id, subscriptions_to_remove);

        let (result1, result2) = futures::future::join(future1, future2).await;

        if result1.is_err() {
            return result1;
        }
        if result2.is_err() {
            return result2;
        }
    }

    Ok(())
}

async fn handle_notifications(
    notifications: Vec<IndexedEvent<Notification>>,
    mut subscriptions: HashMap<UserId, Vec<SubscriptionInfo>>,
    vapid_private_pem: &str,
) -> HashMap<UserId, Vec<String>> {
    let grouped_by_user = group_notifications_by_user(notifications);

    let client = WebPushClient::new();

    let mut futures = Vec::new();
    for (user_id, notifications) in grouped_by_user.into_iter() {
        if let Some(s) = subscriptions.remove(&user_id) {
            futures.push(push_notifications_to_user(
                user_id,
                &client,
                vapid_private_pem,
                notifications,
                s,
            ));
        }
    }

    let results = future::join_all(futures).await;

    let mut subscriptions_to_remove_by_user = HashMap::new();

    for result in results {
        match result {
            Err(e) => {
                error!("{:?}", e);
            }
            Ok((user_id, subscriptions_to_remove)) => {
                if !subscriptions_to_remove.is_empty() {
                    subscriptions_to_remove_by_user.insert(user_id, subscriptions_to_remove);
                }
            }
        }
    }

    subscriptions_to_remove_by_user
}

fn group_notifications_by_user(notifications: Vec<IndexedEvent<Notification>>) -> HashMap<UserId, Vec<Notification>> {
    let mut grouped_by_user: HashMap<UserId, Vec<Notification>> = HashMap::new();

    fn assign_notification_to_user(map: &mut HashMap<UserId, Vec<Notification>>, user_id: UserId, notification: Notification) {
        match map.entry(user_id) {
            Occupied(e) => e.into_mut().push(notification),
            Vacant(e) => {
                e.insert(vec![notification]);
            }
        };
    }

    for n in notifications.into_iter() {
        match &n.value {
            Notification::DirectMessageNotification(d) => {
                assign_notification_to_user(&mut grouped_by_user, d.recipient, n.value.clone());
            }
            Notification::GroupMessageNotification(g) => {
                for u in g.recipients.iter() {
                    assign_notification_to_user(&mut grouped_by_user, *u, n.value.clone());
                }
            }
            Notification::V1DirectMessageNotification(d) => {
                assign_notification_to_user(&mut grouped_by_user, d.recipient, n.value.clone());
            }
            Notification::V1GroupMessageNotification(g) => {
                for u in g.recipients.iter() {
                    assign_notification_to_user(&mut grouped_by_user, *u, n.value.clone());
                }
            }
        }
    }

    grouped_by_user
}

async fn push_notifications_to_user(
    user_id: UserId,
    client: &WebPushClient,
    vapid_private_pem: &str,
    notifications: Vec<Notification>,
    subscriptions: Vec<SubscriptionInfo>,
) -> Result<(UserId, Vec<String>), Error> {
    let serialized = serde_json::to_string(&notifications)?;
    let mut messages = Vec::with_capacity(subscriptions.len());
    for subscription in subscriptions.iter() {
        // TODO: Should not happen inside the loop! But VapidSignatureBuilder::from_pem
        // doesn't like taking a &file
        // But really we want to get the private key from a string in the environment
        let file = File::open(vapid_private_pem).unwrap();
        let sig_builder = VapidSignatureBuilder::from_pem(file, subscription)?;
        let mut builder = WebPushMessageBuilder::new(subscription)?;
        builder.set_payload(ContentEncoding::AesGcm, serialized.as_bytes());
        builder.set_vapid_signature(sig_builder.build()?);
        messages.push(builder.build()?);
    }

    let futures: Vec<_> = messages.into_iter().map(|m| client.send(m)).collect();
    let results = futures::future::join_all(futures).await;

    let mut subscriptions_to_remove = Vec::new();
    for index in 0..subscriptions.len() {
        let result = &results[index];
        match result {
            Ok(_) => (),
            Err(e) => match e {
                WebPushError::EndpointNotValid | WebPushError::InvalidUri | WebPushError::EndpointNotFound => {
                    let subscription_key = subscriptions[index].keys.p256dh.clone();
                    subscriptions_to_remove.push(subscription_key);
                }
                _ => {
                    error!("{:?}", e);
                }
            },
        }
    }

    Ok((user_id, subscriptions_to_remove))
}

fn convert_subscription_info(value: types::SubscriptionInfo) -> SubscriptionInfo {
    SubscriptionInfo {
        endpoint: value.endpoint,
        keys: SubscriptionKeys {
            p256dh: value.keys.p256dh,
            auth: value.keys.auth,
        },
    }
}
