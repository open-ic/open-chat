use crate::env::ENV;
use crate::rng::{random_message_id, random_string};
use crate::utils::now_nanos;
use crate::{client, TestEnv};
use candid::Principal;
use icrc_ledger_types::icrc1::account::Account;
use ledger_utils::create_pending_transaction;
use std::ops::Deref;
use std::time::Duration;
use test_case::test_case;
use types::{
    ChatEvent, CompletedCryptoTransaction, CryptoContent, CryptoTransaction, Cryptocurrency, MessageContent,
    MessageContentInitial, PendingCryptoTransaction,
};

#[test_case(false)]
#[test_case(true)]
fn send_direct_message_with_transfer_succeeds(with_c2c_error: bool) {
    let mut wrapper = ENV.deref().get();
    let TestEnv {
        env,
        canister_ids,
        controller,
        ..
    } = wrapper.env();

    let user1 = client::local_user_index::happy_path::register_user(env, canister_ids.local_user_index);
    let user2 = client::local_user_index::happy_path::register_user(env, canister_ids.local_user_index);

    // Send user1 some ICP
    client::icrc1::happy_path::transfer(env, *controller, canister_ids.icp_ledger, user1.user_id, 1_000_000_000);

    if with_c2c_error {
        env.stop_canister(user2.canister(), Some(canister_ids.local_user_index))
            .unwrap();
    }

    let send_message_result = client::user::send_message_v2(
        env,
        user1.principal,
        user1.user_id.into(),
        &user_canister::send_message_v2::Args {
            recipient: user2.user_id,
            thread_root_message_index: None,
            message_id: random_message_id(),
            content: MessageContentInitial::Crypto(CryptoContent {
                recipient: user2.user_id,
                transfer: CryptoTransaction::Pending(create_pending_transaction(
                    Cryptocurrency::InternetComputer,
                    canister_ids.icp_ledger,
                    10000,
                    10000,
                    user2.user_id,
                    None,
                    now_nanos(env),
                )),
                caption: None,
            }),
            replies_to: None,
            forwarding: false,
            message_filter_failed: None,
            correlation_id: 0,
        },
    );

    assert!(matches!(
        send_message_result,
        user_canister::send_message_v2::Response::TransferSuccessV2(_)
    ));

    let user2_balance = client::icrc1::happy_path::balance_of(env, canister_ids.icp_ledger, user2.user_id);
    assert_eq!(user2_balance, 10000);

    if with_c2c_error {
        env.advance_time(Duration::from_secs(10));
        env.start_canister(user2.canister(), Some(canister_ids.local_user_index))
            .unwrap();
        env.tick();
    }

    let event = client::user::happy_path::events(env, &user2, user1.user_id, 0.into(), true, 10, 10)
        .events
        .pop()
        .unwrap()
        .event;

    if let ChatEvent::Message(m) = event {
        assert!(matches!(m.content, MessageContent::Crypto(_)));
    } else {
        panic!("{event:?}");
    }
}

#[test_case(false)]
#[test_case(true)]
fn send_message_with_transfer_to_group_succeeds(with_c2c_error: bool) {
    let mut wrapper = ENV.deref().get();
    let TestEnv {
        env,
        canister_ids,
        controller,
        ..
    } = wrapper.env();

    let user1 = client::register_diamond_user(env, canister_ids, *controller);
    let user2 = client::local_user_index::happy_path::register_user(env, canister_ids.local_user_index);
    let group_id = client::user::happy_path::create_group(env, &user1, &random_string(), true, true);
    client::local_user_index::happy_path::join_group(env, user2.principal, canister_ids.local_user_index, group_id);

    // Send user1 some ICP
    client::icrc1::happy_path::transfer(env, *controller, canister_ids.icp_ledger, user1.user_id, 1_000_000_000);

    if with_c2c_error {
        env.stop_canister(group_id.into(), Some(canister_ids.local_group_index))
            .unwrap();
    }

    let send_message_result = client::user::send_message_with_transfer_to_group(
        env,
        user1.principal,
        user1.user_id.into(),
        &user_canister::send_message_with_transfer_to_group::Args {
            group_id,
            thread_root_message_index: None,
            message_id: random_message_id(),
            content: MessageContentInitial::Crypto(CryptoContent {
                recipient: user2.user_id,
                transfer: CryptoTransaction::Pending(create_pending_transaction(
                    Cryptocurrency::InternetComputer,
                    canister_ids.icp_ledger,
                    10000,
                    10000,
                    user2.user_id,
                    None,
                    now_nanos(env),
                )),
                caption: None,
            }),
            sender_name: user1.username(),
            sender_display_name: None,
            replies_to: None,
            mentioned: Vec::new(),
            rules_accepted: None,
            message_filter_failed: None,
            correlation_id: 0,
        },
    );

    if with_c2c_error {
        assert!(matches!(
            send_message_result,
            user_canister::send_message_with_transfer_to_group::Response::Retrying(..)
        ));
    } else {
        assert!(matches!(
            send_message_result,
            user_canister::send_message_with_transfer_to_group::Response::Success(_)
        ));
    }

    let user2_balance = client::icrc1::happy_path::balance_of(env, canister_ids.icp_ledger, user2.user_id);
    assert_eq!(user2_balance, 10000);

    if with_c2c_error {
        env.advance_time(Duration::from_secs(10));
        env.start_canister(group_id.into(), Some(canister_ids.local_group_index))
            .unwrap();
        env.tick();
    }

    let event = client::group::happy_path::events(env, &user2, group_id, 0.into(), true, 10, 10)
        .events
        .pop()
        .unwrap()
        .event;

    if let ChatEvent::Message(m) = event {
        assert!(matches!(m.content, MessageContent::Crypto(_)));
    } else {
        panic!("{event:?}");
    }
}

#[test]
fn send_icp_as_icrc1_converted_to_nns_format() {
    let mut wrapper = ENV.deref().get();
    let TestEnv {
        env,
        canister_ids,
        controller,
        ..
    } = wrapper.env();

    let user1 = client::local_user_index::happy_path::register_user(env, canister_ids.local_user_index);
    let user2 = client::local_user_index::happy_path::register_user(env, canister_ids.local_user_index);

    // Send user1 some ICP
    client::icrc1::happy_path::transfer(env, *controller, canister_ids.icp_ledger, user1.user_id, 1_000_000_000);

    let send_message_result = client::user::send_message_v2(
        env,
        user1.principal,
        user1.user_id.into(),
        &user_canister::send_message_v2::Args {
            recipient: user2.user_id,
            thread_root_message_index: None,
            message_id: random_message_id(),
            content: MessageContentInitial::Crypto(CryptoContent {
                recipient: user2.user_id,
                transfer: CryptoTransaction::Pending(PendingCryptoTransaction::ICRC1(types::icrc1::PendingCryptoTransaction {
                    ledger: canister_ids.icp_ledger,
                    token: Cryptocurrency::InternetComputer,
                    amount: 10000,
                    to: Account::from(Principal::from(user2.user_id)),
                    fee: 10000,
                    memo: None,
                    created: now_nanos(env),
                })),
                caption: None,
            }),
            replies_to: None,
            forwarding: false,
            message_filter_failed: None,
            correlation_id: 0,
        },
    );

    if let user_canister::send_message_v2::Response::TransferSuccessV2(r) = &send_message_result {
        let event = client::user::happy_path::events_by_index(env, &user1, user2.user_id, vec![r.event_index])
            .events
            .pop()
            .unwrap();

        if let ChatEvent::Message(m) = event.event {
            if let MessageContent::Crypto(c) = m.content {
                assert!(matches!(
                    c.transfer,
                    CryptoTransaction::Completed(CompletedCryptoTransaction::NNS(_))
                ));
                return;
            }
        }
    }

    panic!("{send_message_result:?}")
}
