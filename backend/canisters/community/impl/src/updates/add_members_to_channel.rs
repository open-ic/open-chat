use crate::{activity_notifications::handle_activity_notification, mutate_state, read_state, run_regular_jobs, RuntimeState};
use canister_tracing_macros::trace;
use chat_events::ChatEventInternal;
use community_canister::add_members_to_channel::{Response::*, *};
use gated_groups::{check_if_passes_gate, CheckGateArgs, CheckIfPassesGateResult};
use group_chat_core::AddResult;
use ic_cdk::update;
use std::collections::HashMap;
use std::iter::zip;
use types::{
    AccessGate, AddedToChannelNotification, CanisterId, ChannelId, EventIndex, MembersAdded, MessageIndex, Notification,
    TimestampNanos, UserId,
};

#[update]
#[trace]
async fn add_members_to_channel(args: Args) -> Response {
    run_regular_jobs();

    let prepare_result = match read_state(|state| prepare(&args, state)) {
        Ok(ok) => ok,
        Err(response) => return response,
    };

    let mut users_to_add: Vec<UserId> = Vec::new();
    let mut users_failed_gate_check: Vec<UserFailedGateCheck> = Vec::new();
    let mut users_failed_with_error: Vec<UserFailedError> = Vec::new();

    if let Some(gate) = prepare_result.gate {
        let diamond_membership_expiry_dates: HashMap<_, _> = if matches!(gate, AccessGate::DiamondMember) {
            match local_user_index_canister_c2c_client::c2c_diamond_membership_expiry_dates(
                prepare_result.local_user_index_canister_id,
                &local_user_index_canister::c2c_diamond_membership_expiry_dates::Args {
                    user_ids: prepare_result.users_to_add.clone(),
                },
            )
            .await
            {
                Ok(local_user_index_canister::c2c_diamond_membership_expiry_dates::Response::Success(expiry_dates)) => {
                    expiry_dates
                }
                Err(error) => return InternalError(format!("{error:?}")),
            }
        } else {
            HashMap::new()
        };

        let futures: Vec<_> = prepare_result
            .users_to_add
            .iter()
            .map(|user_id| {
                check_if_passes_gate(
                    gate.clone(),
                    CheckGateArgs {
                        user_id: *user_id,
                        diamond_membership_expires_at: diamond_membership_expiry_dates.get(user_id).copied(),
                        this_canister: prepare_result.this_canister,
                        unique_person_proof: None,
                        verified_credential_args: None,
                        now: prepare_result.now_nanos,
                    },
                )
            })
            .collect();

        let results = futures::future::join_all(futures).await;

        for (user_id, result) in zip(prepare_result.users_to_add, results) {
            match result {
                CheckIfPassesGateResult::Success => users_to_add.push(user_id),
                CheckIfPassesGateResult::Failed(reason) => {
                    users_failed_gate_check.push(UserFailedGateCheck { user_id, reason })
                }
                CheckIfPassesGateResult::InternalError(error) => {
                    users_failed_with_error.push(UserFailedError { user_id, error })
                }
            }
        }
    } else {
        users_to_add = prepare_result.users_to_add;
    }

    mutate_state(|state| {
        commit(
            prepare_result.user_id,
            args.added_by_name,
            prepare_result.member_display_name.or(args.added_by_display_name),
            args.channel_id,
            users_to_add,
            prepare_result.users_already_in_channel,
            users_failed_gate_check,
            users_failed_with_error,
            prepare_result.is_bot,
            state,
        )
    })
}

struct PrepareResult {
    user_id: UserId,
    users_to_add: Vec<UserId>,
    users_already_in_channel: Vec<UserId>,
    gate: Option<AccessGate>,
    local_user_index_canister_id: CanisterId,
    is_bot: bool,
    member_display_name: Option<String>,
    this_canister: CanisterId,
    now_nanos: TimestampNanos,
}

#[allow(clippy::result_large_err)]
fn prepare(args: &Args, state: &RuntimeState) -> Result<PrepareResult, Response> {
    if state.data.is_frozen() {
        return Err(CommunityFrozen);
    }

    let caller = state.env.caller();

    if let Some(member) = state.data.members.get(caller) {
        if member.suspended.value {
            return Err(UserSuspended);
        }

        let user_id = member.user_id;

        if let Some(channel) = state.data.channels.get(&args.channel_id) {
            if let Some(limit) = channel.chat.members.user_limit_reached() {
                Err(UserLimitReached(limit))
            } else if let Some(channel_member) = channel.chat.members.get(&user_id) {
                let permissions = &channel.chat.permissions;
                if !channel_member.role.can_add_members(permissions) {
                    return Err(NotAuthorized);
                }

                let (users_already_in_channel, users_to_add): (Vec<_>, Vec<_>) = args
                    .user_ids
                    .iter()
                    .copied()
                    .partition(|id| channel.chat.members.contains(id));

                Ok(PrepareResult {
                    user_id,
                    users_to_add,
                    users_already_in_channel,
                    gate: channel.chat.gate.as_ref().cloned(),
                    local_user_index_canister_id: state.data.local_user_index_canister_id,
                    is_bot: member.is_bot,
                    member_display_name: member.display_name().value.clone(),
                    this_canister: state.env.canister_id(),
                    now_nanos: state.env.now_nanos(),
                })
            } else {
                Err(UserNotInChannel)
            }
        } else {
            Err(ChannelNotFound)
        }
    } else {
        Err(UserNotInCommunity)
    }
}

#[allow(clippy::too_many_arguments)]
fn commit(
    added_by: UserId,
    added_by_name: String,
    added_by_display_name: Option<String>,
    channel_id: ChannelId,
    users_to_add: Vec<UserId>,
    mut users_already_in_channel: Vec<UserId>,
    users_failed_gate_check: Vec<UserFailedGateCheck>,
    mut users_failed_with_error: Vec<UserFailedError>,
    is_bot: bool,
    state: &mut RuntimeState,
) -> Response {
    if let Some(channel) = state.data.channels.get_mut(&channel_id) {
        let mut min_visible_event_index = EventIndex::default();
        let mut min_visible_message_index = MessageIndex::default();

        if !channel.chat.history_visible_to_new_joiners {
            let events_reader = channel.chat.events.main_events_reader();
            min_visible_event_index = events_reader.next_event_index();
            min_visible_message_index = events_reader.next_message_index();
        }

        let now = state.env.now();

        let mut users_added: Vec<UserId> = Vec::new();
        let mut users_limit_reached: Vec<UserId> = Vec::new();

        for user_id in users_to_add {
            match channel.chat.members.add(
                user_id,
                now,
                min_visible_event_index,
                min_visible_message_index,
                channel.chat.is_public.value,
                is_bot,
            ) {
                AddResult::Success(_) => {
                    users_added.push(user_id);
                    state.data.members.mark_member_joined_channel(&user_id, channel_id);
                }
                AddResult::AlreadyInGroup => users_already_in_channel.push(user_id),
                AddResult::MemberLimitReached(_) => users_limit_reached.push(user_id),
                AddResult::Blocked => users_failed_with_error.push(UserFailedError {
                    user_id,
                    error: "User blocked".to_string(),
                }),
            }
        }

        if users_added.is_empty() {
            return Failed(FailedResult {
                users_already_in_channel,
                users_limit_reached,
                users_failed_gate_check,
                users_failed_with_error,
            });
        }

        let event = MembersAdded {
            user_ids: users_added.clone(),
            added_by,
            unblocked: Vec::new(),
        };

        channel
            .chat
            .events
            .push_main_event(ChatEventInternal::ParticipantsAdded(Box::new(event)), 0, now);

        let notification = Notification::AddedToChannel(AddedToChannelNotification {
            community_id: state.env.canister_id().into(),
            community_name: state.data.name.clone(),
            channel_id,
            channel_name: channel.chat.name.value.clone(),
            added_by,
            added_by_name,
            added_by_display_name,
            community_avatar_id: state.data.avatar.as_ref().map(|d| d.id),
            channel_avatar_id: channel.chat.avatar.as_ref().map(|d| d.id),
        });

        state.push_notification(users_added.clone(), notification);

        handle_activity_notification(state);

        if !users_already_in_channel.is_empty() || !users_failed_gate_check.is_empty() || !users_failed_with_error.is_empty() {
            PartialSuccess(PartialSuccessResult {
                users_added,
                users_limit_reached,
                users_already_in_channel,
                users_failed_gate_check,
                users_failed_with_error,
            })
        } else {
            Success
        }
    } else {
        ChannelNotFound
    }
}
