use crate::activity_notifications::handle_activity_notification;
use crate::{mutate_state, run_regular_jobs, RuntimeState};
use canister_tracing_macros::trace;
use chat_events::ChatEventInternal;
use group_canister::disable_invite_code::{Response::*, *};
use ic_cdk_macros::update;
use types::{GroupInviteCodeChange, GroupInviteCodeChanged};

#[update]
#[trace]
fn disable_invite_code(args: Args) -> Response {
    run_regular_jobs();

    mutate_state(|state| disable_invite_code_impl(args, state))
}

fn disable_invite_code_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    if runtime_state.data.is_frozen() {
        return ChatFrozen;
    }

    let caller = runtime_state.env.caller();
    if let Some(member) = runtime_state.data.get_member(caller) {
        if member.suspended.value {
            return UserSuspended;
        }

        if member.role.can_invite_users(&runtime_state.data.group_chat_core.permissions) {
            let user_id = member.user_id;
            runtime_state.data.invite_code_enabled = false;

            let now = runtime_state.env.now();
            runtime_state.data.group_chat_core.events.push_main_event(
                ChatEventInternal::GroupInviteCodeChanged(Box::new(GroupInviteCodeChanged {
                    change: GroupInviteCodeChange::Disabled,
                    changed_by: user_id,
                })),
                args.correlation_id,
                now,
            );

            handle_activity_notification(runtime_state);

            return Success;
        }
    }

    NotAuthorized
}
