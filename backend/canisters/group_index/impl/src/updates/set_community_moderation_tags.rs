use crate::{model::moderation_tags::ModerationTags, mutate_state, read_state, RuntimeState};
use candid::Principal;
use canister_tracing_macros::trace;
use group_index_canister::set_community_moderation_tags::{Response::*, *};
use ic_cdk_macros::update;
use types::CanisterId;
use user_index_canister_c2c_client::{lookup_user, LookupUserError};

#[update]
#[trace]
async fn set_community_moderation_tags(args: Args) -> Response {
    let PrepareResult {
        caller,
        user_index_canister_id,
        ..
    } = match read_state(|state| prepare(&args, state)) {
        Ok(result) => result,
        Err(response) => return response,
    };

    match lookup_user(caller, user_index_canister_id).await {
        Ok(user) if user.is_platform_moderator => (),
        Ok(_) | Err(LookupUserError::UserNotFound) => return NotAuthorized,
        Err(LookupUserError::InternalError(error)) => return InternalError(error),
    };

    mutate_state(|state| commit(&args, state))
}

struct PrepareResult {
    caller: Principal,
    user_index_canister_id: CanisterId,
}

fn prepare(args: &Args, state: &RuntimeState) -> Result<PrepareResult, Response> {
    if let Some(community) = state.data.public_communities.get(&args.community_id) {
        if args.tags == community.moderation_tags().bits() {
            return Err(Unchanged);
        }

        if ModerationTags::from_bits(args.tags).is_none() {
            return Err(InvalidTags);
        }

        Ok(PrepareResult {
            caller: state.env.caller(),
            user_index_canister_id: state.data.user_index_canister_id,
        })
    } else {
        Err(CommunityNotFound)
    }
}

fn commit(args: &Args, state: &mut RuntimeState) -> Response {
    if let Some(community) = state.data.public_communities.get_mut(&args.community_id) {
        community.set_moderation_tags(ModerationTags::from_bits(args.tags).unwrap());
        Success
    } else {
        CommunityNotFound
    }
}
