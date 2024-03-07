use crate::guards::caller_is_openchat_user;
use crate::{mutate_state, read_state, RuntimeState};
use candid::Principal;
use canister_tracing_macros::trace;
use ic_cdk_macros::update;
use local_user_index_canister::invite_users_to_community::{Response::*, *};
use types::{CommunityId, MessageContent, TextContent, User, UserId};

#[update(guard = "caller_is_openchat_user")]
#[trace]
async fn invite_users_to_community(args: Args) -> Response {
    let PrepareResult { invited_by, users } = read_state(|state| prepare(&args, state));

    let c2c_args = community_canister::c2c_invite_users::Args {
        caller: invited_by,
        users,
    };

    match community_canister_c2c_client::c2c_invite_users(args.community_id.into(), &c2c_args).await {
        Ok(response) => match response {
            community_canister::c2c_invite_users::Response::Success(s) => {
                mutate_state(|state| {
                    commit(
                        invited_by,
                        args.caller_username,
                        args.community_id,
                        s.community_name,
                        s.invited_users,
                        state,
                    );
                });
                Success
            }
            community_canister::c2c_invite_users::Response::UserNotInCommunity => UserNotInCommunity,
            community_canister::c2c_invite_users::Response::NotAuthorized => NotAuthorized,
            community_canister::c2c_invite_users::Response::CommunityFrozen => CommunityFrozen,
            community_canister::c2c_invite_users::Response::TooManyInvites(l) => TooManyInvites(l),
            community_canister::c2c_invite_users::Response::UserSuspended => UserSuspended,
        },
        Err(error) => InternalError(format!("Failed to call 'community::c2c_invite_users': {error:?}")),
    }
}

struct PrepareResult {
    invited_by: UserId,
    users: Vec<(UserId, Principal)>,
}

fn prepare(args: &Args, state: &RuntimeState) -> PrepareResult {
    let invited_by = state.calling_user().user_id;
    let users = args
        .user_ids
        .iter()
        .filter_map(|user_id| state.data.global_users.get(&(*user_id).into()))
        .map(|user| (user.user_id, user.principal))
        .collect();
    PrepareResult { invited_by, users }
}

fn commit(
    invited_by: UserId,
    invited_by_username: String,
    community_id: CommunityId,
    community_name: String,
    invited_users: Vec<UserId>,
    state: &mut RuntimeState,
) {
    let text = format!(
        "You have been invited to the community [{community_name}](/community/{community_id}) by @UserId({invited_by})."
    );
    let message = MessageContent::Text(TextContent { text });
    let mentioned = vec![User {
        user_id: invited_by,
        username: invited_by_username,
    }];

    for user_id in invited_users {
        state.push_oc_bot_message_to_user(user_id, message.clone(), mentioned.clone());
    }

    crate::jobs::sync_events_to_user_canisters::try_run_now(state);
    crate::jobs::sync_events_to_user_index_canister::try_run_now(state);
}
