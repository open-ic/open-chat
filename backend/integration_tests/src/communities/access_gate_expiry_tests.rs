use crate::client::user_index;
use crate::env::ENV;
use crate::utils::tick_many;
use crate::{client, CanisterIds, TestEnv, User};
use candid::Principal;
use event_store_canister::Milliseconds;
use pocket_ic::PocketIc;
use std::ops::Deref;
use std::time::Duration;
use test_case::test_case;
use testing::rng::random_string;
use types::{
    AccessGate, AccessGateConfig, ChannelId, CommunityId, DiamondMembershipPlanDuration, OptionUpdate, TokenBalanceGate,
};

const DAY_IN_MS: Milliseconds = 24 * 60 * 60 * 1000;

#[test_case(true)]
#[test_case(false)]
fn diamond_member_lapses_and_rejoins_successfully(channel: bool) {
    // Create 2 diamond users, a public community and a public channel
    let mut wrapper = ENV.deref().get();
    let TestEnv {
        env,
        canister_ids,
        controller,
    } = wrapper.env();

    let TestData {
        user1,
        user2,
        community_id,
        channel_id,
    } = init_test_data(env, canister_ids, *controller);

    // Depending on the test branch either update the community or channel
    // with an expiring diamond access gate
    let gate_config_update = OptionUpdate::SetToSome(AccessGateConfig {
        gate: AccessGate::DiamondMember,
        expiry: Some(15 * DAY_IN_MS),
    });

    if channel {
        update_channel_gate(env, user1.principal, community_id, channel_id, gate_config_update);
    } else {
        update_community_gate(env, user1.principal, community_id, gate_config_update);
    }

    // User 2 joins the channel
    client::local_user_index::happy_path::join_channel(
        env,
        user2.principal,
        canister_ids.local_user_index,
        community_id,
        channel_id,
    );

    // Move the time forward so that user2's diamond membership expires + the gate expiry
    env.advance_time(Duration::from_millis(46 * DAY_IN_MS));
    tick_many(env, 10);

    // Assert that user2 has lapsed
    assert_user_lapsed(env, channel, &user2, community_id, channel_id, true);

    // Buy Diamond again
    client::upgrade_user(
        &user2,
        env,
        canister_ids,
        *controller,
        DiamondMembershipPlanDuration::OneMonth,
        false,
    );

    // User2 rejoins channel
    client::local_user_index::happy_path::join_channel(
        env,
        user2.principal,
        canister_ids.local_user_index,
        community_id,
        channel_id,
    );

    // Assert that user2 is no longer lapsed
    assert_user_lapsed(env, channel, &user2, community_id, channel_id, false);
}

#[test_case(true)]
#[test_case(false)]
fn remove_gate_unlapses_members(channel: bool) {
    // Create 2 diamond users, a public community and a public channel
    let mut wrapper = ENV.deref().get();
    let TestEnv {
        env,
        canister_ids,
        controller,
    } = wrapper.env();

    let TestData {
        user1,
        user2,
        community_id,
        channel_id,
    } = init_test_data(env, canister_ids, *controller);

    // Depending on the test branch either update the community or channel
    // with an expiring diamond access gate
    let gate_config_update = OptionUpdate::SetToSome(AccessGateConfig {
        gate: AccessGate::DiamondMember,
        expiry: Some(15 * DAY_IN_MS),
    });

    if channel {
        update_channel_gate(env, user1.principal, community_id, channel_id, gate_config_update);
    } else {
        update_community_gate(env, user1.principal, community_id, gate_config_update);
    }

    // User 2 joins the channel
    client::local_user_index::happy_path::join_channel(
        env,
        user2.principal,
        canister_ids.local_user_index,
        community_id,
        channel_id,
    );

    // Move the time forward so that user2's diamond membership expires + the gate expiry
    env.advance_time(Duration::from_millis(46 * DAY_IN_MS));
    tick_many(env, 10);

    // Assert that user2 has lapsed
    assert_user_lapsed(env, channel, &user2, community_id, channel_id, true);

    // Remove the gate
    if channel {
        update_channel_gate(env, user1.principal, community_id, channel_id, OptionUpdate::SetToNone);
    } else {
        update_community_gate(env, user1.principal, community_id, OptionUpdate::SetToNone);
    }

    // Assert that user2 is no longer lapsed
    assert_user_lapsed(env, channel, &user2, community_id, channel_id, false);
}

// #[test_case(true, true)]
// #[test_case(true, false)]
// #[test_case(false, true)]
// #[test_case(false, false)]
// fn extend_or_reduce_expiry_then_member_lapses_when_expected(channel: bool, extend_expiry: bool) {
//     // Create 2 diamond users, a public community and a public channel
//     let mut wrapper = ENV.deref().get();
//     let TestEnv {
//         env,
//         canister_ids,
//         controller,
//     } = wrapper.env();

//     let TestData {
//         user1,
//         user2,
//         community_id,
//         channel_id,
//     } = init_test_data(env, canister_ids, *controller);

//     // Depending on the test branch either update the community or channel
//     // with an expiring diamond access gate
//     let gate_config_update = OptionUpdate::SetToSome(AccessGateConfig {
//         gate: AccessGate::DiamondMember,
//         expiry: Some(15 * DAY_IN_MS),
//     });

//     if channel {
//         update_channel_gate(env, user1.principal, community_id, channel_id, gate_config_update);
//     } else {
//         update_community_gate(env, user1.principal, community_id, gate_config_update);
//     }

//     // User 2 joins the channel
//     client::local_user_index::happy_path::join_channel(
//         env,
//         user2.principal,
//         canister_ids.local_user_index,
//         community_id,
//         channel_id,
//     );

//     // Move the time forward so that user2's diamond membership expires + the gate expiry
//     env.advance_time(Duration::from_millis(46 * DAY_IN_MS));
//     tick_many(env, 10);

//     // Assert that user2 has lapsed
//     assert_user_lapsed(env, channel, &user2, community_id, channel_id, true);
// }

#[test_case(true)]
#[test_case(false)]
fn member_lapses_from_token_balance_gate_and_rejoins_successfully(channel: bool) {
    // Create 2 diamond users, a public community and a public channel
    let mut wrapper = ENV.deref().get();
    let TestEnv {
        env,
        canister_ids,
        controller,
    } = wrapper.env();

    let TestData {
        user1,
        user2,
        community_id,
        channel_id,
    } = init_test_data(env, canister_ids, *controller);

    // Depending on the test branch either update the community or channel
    // with a token balance gate
    let min_balance = 500_000_000;
    let gate_config_update = OptionUpdate::SetToSome(AccessGateConfig {
        gate: AccessGate::TokenBalance(TokenBalanceGate {
            ledger_canister_id: canister_ids.icp_ledger,
            min_balance,
        }),
        expiry: Some(DAY_IN_MS),
    });

    if channel {
        update_channel_gate(env, user1.principal, community_id, channel_id, gate_config_update);
    } else {
        update_community_gate(env, user1.principal, community_id, gate_config_update);
    }

    // User 2 joins the channel
    client::local_user_index::happy_path::join_channel(
        env,
        user2.principal,
        canister_ids.local_user_index,
        community_id,
        channel_id,
    );

    // Move the time forward so that the gate expires
    env.advance_time(Duration::from_millis(2 * DAY_IN_MS));
    tick_many(env, 5);

    // User2 should have sufficient balance so should not be lapsed
    assert_user_lapsed(env, channel, &user2, community_id, channel_id, false);

    // User2 upgrades to 3 month diamond to reduce their token balance
    user_index::happy_path::pay_for_diamond_membership(
        env,
        user2.principal,
        canister_ids.user_index,
        DiamondMembershipPlanDuration::ThreeMonths,
        false,
        false,
    );

    tick_many(env, 4);

    // Move the time forward so that the gate expires
    env.advance_time(Duration::from_millis(2 * DAY_IN_MS));
    tick_many(env, 5);

    // Assert that user2 has lapsed
    assert_user_lapsed(env, channel, &user2, community_id, channel_id, true);

    // Increase token balance
    client::ledger::happy_path::transfer(env, *controller, canister_ids.icp_ledger, user2.user_id, min_balance);

    // User2 rejoins channel
    client::local_user_index::happy_path::join_channel(
        env,
        user2.principal,
        canister_ids.local_user_index,
        community_id,
        channel_id,
    );

    // Assert that user2 is no longer lapsed
    assert_user_lapsed(env, channel, &user2, community_id, channel_id, false);
}

fn assert_user_lapsed(
    env: &mut PocketIc,
    channel: bool,
    user: &User,
    community_id: CommunityId,
    channel_id: ChannelId,
    lapsed: bool,
) {
    if channel {
        let summary = client::community::happy_path::channel_summary(env, user, community_id, channel_id);
        assert!(summary.membership.map_or(false, |m| m.lapsed == lapsed));
    } else {
        let summary = client::community::happy_path::summary(env, user, community_id);
        assert!(summary.membership.map_or(false, |m| m.lapsed == lapsed));
    }
}

fn update_community_gate(
    env: &mut PocketIc,
    principal: Principal,
    community_id: CommunityId,
    gate_config_update: OptionUpdate<AccessGateConfig>,
) {
    let args = community_canister::update_community::Args {
        name: None,
        description: None,
        rules: None,
        avatar: OptionUpdate::NoChange,
        banner: OptionUpdate::NoChange,
        permissions: None,
        gate: OptionUpdate::NoChange,
        gate_config: gate_config_update,
        public: None,
        primary_language: None,
    };

    client::community::happy_path::update_community(env, principal, community_id, &args);
}

fn update_channel_gate(
    env: &mut PocketIc,
    principal: Principal,
    community_id: CommunityId,
    channel_id: ChannelId,
    gate_config_update: OptionUpdate<AccessGateConfig>,
) {
    let args = community_canister::update_channel::Args {
        channel_id,
        name: None,
        description: None,
        rules: None,
        avatar: OptionUpdate::NoChange,
        permissions_v2: None,
        events_ttl: OptionUpdate::NoChange,
        gate: OptionUpdate::NoChange,
        gate_config: gate_config_update,
        public: None,
        messages_visible_to_non_members: None,
        external_url: OptionUpdate::NoChange,
    };

    client::community::happy_path::update_channel(env, principal, community_id, &args);
}

fn init_test_data(env: &mut PocketIc, canister_ids: &CanisterIds, controller: Principal) -> TestData {
    let user1 = client::register_diamond_user(env, canister_ids, controller);
    let user2 = client::register_user(env, canister_ids);

    // Upgrade user 2 to non-recurring diamond membership
    client::upgrade_user(
        &user2,
        env,
        canister_ids,
        controller,
        DiamondMembershipPlanDuration::OneMonth,
        false,
    );

    let community_id = client::user::happy_path::create_community(env, &user1, &random_string(), true, vec![random_string()]);
    let channel_id = client::community::happy_path::create_channel(env, user1.principal, community_id, true, random_string());

    TestData {
        user1,
        user2,
        community_id,
        channel_id,
    }
}

struct TestData {
    user1: User,
    user2: User,
    community_id: CommunityId,
    channel_id: ChannelId,
}
