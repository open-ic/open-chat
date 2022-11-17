use crate::guards::caller_is_controller;
use crate::model::set_user_frozen_queue::{SetUserFrozen, SetUserFrozenInGroup};
use crate::{mutate_state, RuntimeState};
use canister_tracing_macros::trace;
use ic_cdk_macros::update;
use types::{ChatId, UserId};
use user_index_canister::unfreeze_user::{Response::*, *};

#[update(guard = "caller_is_controller")]
#[trace]
async fn unfreeze_user(args: Args) -> Response {
    unfreeze_user_impl(args.user_id).await
}

pub(crate) async fn unfreeze_user_impl(user_id: UserId) -> Response {
    let c2c_args = user_canister::c2c_set_user_frozen::Args { frozen: false };
    match user_canister_c2c_client::c2c_set_user_frozen(user_id.into(), &c2c_args).await {
        Ok(user_canister::c2c_set_user_frozen::Response::Success(result)) => {
            mutate_state(|state| commit(user_id, result.groups, state));
            Success
        }
        Err(error) => InternalError(format!("{error:?}")),
    }
}

fn commit(user_id: UserId, groups: Vec<ChatId>, runtime_state: &mut RuntimeState) {
    runtime_state.data.set_user_frozen_queue.enqueue(
        groups
            .into_iter()
            .map(|g| {
                SetUserFrozen::Group(SetUserFrozenInGroup {
                    user_id,
                    group: g,
                    frozen: false,
                    attempt: 0,
                })
            })
            .collect(),
    );

    runtime_state.data.users.unfreeze_user(&user_id);
}
