use crate::activity_notifications::handle_activity_notification;
use crate::{mutate_state, run_regular_jobs, RuntimeState};
use canister_tracing_macros::trace;
use community_canister::delete_user_groups::{Response::*, *};
use ic_cdk_macros::update;

#[update]
#[trace]
fn delete_user_groups(args: Args) -> Response {
    run_regular_jobs();

    mutate_state(|state| delete_user_groups_impl(args, state))
}

fn delete_user_groups_impl(args: Args, state: &mut RuntimeState) -> Response {
    if state.data.is_frozen() {
        return CommunityFrozen;
    }

    let caller = state.env.caller();
    match state.data.members.get(caller) {
        Some(m) if m.suspended.value => UserSuspended,
        Some(m) if m.role.can_manage_user_groups(&state.data.permissions) => {
            let now = state.env.now();

            let mut updated = false;
            for user_group_id in args.user_group_ids {
                if state.data.members.delete_user_groups(user_group_id, now) {
                    updated = true;
                }
            }
            if updated {
                handle_activity_notification(state);
            }
            Success
        }
        _ => NotAuthorized,
    }
}
