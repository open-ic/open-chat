use super::expire_members;
use crate::{mutate_state, read_state, RuntimeState};
use gated_groups::{check_if_passes_gate, check_if_passes_gate_synchronously, CheckGateArgs, CheckIfPassesGateResult};
use group_community_common::{ExpiringMember, ExpiringMemberAction, ExpiringMemberActionDetails, Members};
use ic_cdk_timers::TimerId;
use local_user_index_canister_c2c_client::lookup_users;
use std::cell::Cell;
use std::time::Duration;
use tracing::trace;
use types::AccessGateConfigInternal;

thread_local! {
    static TIMER_ID: Cell<Option<TimerId>> = Cell::default();
}

pub(crate) fn start_job_if_required(state: &RuntimeState) -> bool {
    if TIMER_ID.get().is_none() && !state.data.expiring_member_actions.is_empty() {
        let timer_id = ic_cdk_timers::set_timer(Duration::ZERO, run);
        TIMER_ID.set(Some(timer_id));
        true
    } else {
        false
    }
}

fn run() {
    trace!("'process_expire_member_actions' job running");
    TIMER_ID.set(None);

    let actions = mutate_state(|state| state.data.expiring_member_actions.pop_batch());

    for action in actions {
        ic_cdk::spawn(process_action(action));
    }

    read_state(start_job_if_required);
}

async fn process_action(action: ExpiringMemberAction) {
    match action {
        ExpiringMemberAction::Batch(batch) => process_batch(batch).await,
        ExpiringMemberAction::Single(details) => process_gate_check_async(details).await,
    }
}

async fn process_batch(batch: Vec<ExpiringMemberActionDetails>) {
    let local_user_index_canister = read_state(|state| state.data.local_user_index_canister_id);
    let user_ids = batch.iter().map(|details| details.user_id).collect();

    let lookup_users_result = lookup_users(user_ids, local_user_index_canister).await;

    mutate_state(|state| {
        match lookup_users_result {
            Ok(user_details) => {
                for u in user_details.values() {
                    state
                        .data
                        .user_cache
                        .insert(u.user_id, u.diamond_membership_expires_at, u.unique_person_proof.is_some());
                }

                for details in batch {
                    process_gate_check_sync(details, state);
                }
            }
            Err(err) => {
                for details in batch {
                    handle_gate_check_result(details, CheckIfPassesGateResult::InternalError(err.to_string()), state);
                }
            }
        }

        expire_members::restart_job(state);
    });
}

fn process_gate_check_sync(details: ExpiringMemberActionDetails, state: &mut RuntimeState) {
    let Some(prep) = prepare_gate_check(details) else {
        return;
    };

    let Some(result) = check_if_passes_gate_synchronously(prep.gate_config.gate, prep.check_gate_args) else {
        return;
    };

    handle_gate_check_result(prep.details, result, state);
}

async fn process_gate_check_async(details: ExpiringMemberActionDetails) {
    let Some(prep) = prepare_gate_check(details) else {
        return;
    };

    let result = check_if_passes_gate(prep.gate_config.gate, prep.check_gate_args).await;

    mutate_state(|state| {
        handle_gate_check_result(prep.details, result, state);

        expire_members::restart_job(state);
    });
}

struct PrepareResult {
    details: ExpiringMemberActionDetails,
    gate_config: AccessGateConfigInternal,
    check_gate_args: CheckGateArgs,
}

fn prepare_gate_check(details: ExpiringMemberActionDetails) -> Option<PrepareResult> {
    read_state(|state| {
        let gate_config = state.data.chat.gate_config.value.clone()?;

        let (diamond_membership_expires_at, is_unique_person) = state
            .data
            .user_cache
            .get(&details.user_id)
            .map_or((None, false), |u| (u.diamond_membership_expires_at, u.is_unique_person));

        let check_gate_args = CheckGateArgs {
            user_id: details.user_id,
            diamond_membership_expires_at,
            this_canister: state.env.canister_id(),
            is_unique_person,
            verified_credential_args: None,
            referred_by_member: false,
            now: state.env.now(),
        };

        Some(PrepareResult {
            details,
            gate_config,
            check_gate_args,
        })
    })
}

fn handle_gate_check_result(details: ExpiringMemberActionDetails, result: CheckIfPassesGateResult, state: &mut RuntimeState) {
    // If there is no longer an access gate then do nothing
    let Some(gate_config) = state.data.chat.gate_config.value.as_ref() else {
        return;
    };

    // If the access gate no longer expires then do nothing
    let Some(curr_gate_expiry) = gate_config.expiry() else {
        return;
    };

    // If the access gate has changed type then do nothing
    if details.original_gate_type != gate_config.gate().into() {
        return;
    }

    // If the member can no longer lapse then do nothing
    if !state.data.chat.members.can_member_lapse(&details.user_id) {
        return;
    }

    let now = state.env.now();

    // Determine if the gate expiry has increased since the action was added to the queue
    let expiry_increase = curr_gate_expiry.saturating_sub(details.original_gate_expiry);

    if matches!(result, CheckIfPassesGateResult::Failed(_)) && expiry_increase == 0 {
        // Membership lapsed
        state.data.chat.members.mark_member_lapsed(&details.user_id, now);
        return;
    }

    // In all other cases re-queue the check
    let expiry = match result {
        CheckIfPassesGateResult::Success => curr_gate_expiry,
        _ => expiry_increase,
    };

    state.data.expiring_members.push(ExpiringMember {
        expires: now + expiry,
        channel_id: None,
        user_id: details.user_id,
    });
}
