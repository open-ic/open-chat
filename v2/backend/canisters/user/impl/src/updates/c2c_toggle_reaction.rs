use crate::{RuntimeState, RUNTIME_STATE};
use chat_events::ToggleReactionResult;
use cycles_utils::check_cycles_balance;
use ic_cdk_macros::update;
use user_canister::c2c_toggle_reaction::{Response::*, *};

#[update]
fn c2c_toggle_reaction(args: Args) -> Response {
    check_cycles_balance();

    if args.reaction.is_valid() {
        RUNTIME_STATE.with(|state| c2c_toggle_reaction_impl(args, state.borrow_mut().as_mut().unwrap()))
    } else {
        InvalidReaction
    }
}

fn c2c_toggle_reaction_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let caller = runtime_state.env.caller();

    if let Some(chat) = runtime_state.data.direct_chats.get_mut(&caller.into()) {
        let now = runtime_state.env.now();

        let exists = chat.events.reaction_exists(caller.into(), &args.message_id, &args.reaction);

        if exists == args.added {
            return if args.added { Added } else { Removed };
        }

        let their_user_id = caller.into();

        match chat
            .events
            .toggle_reaction(their_user_id, args.message_id, args.reaction, now)
        {
            ToggleReactionResult::Added => Added,
            ToggleReactionResult::Removed => Removed,
            ToggleReactionResult::MessageNotFound => MessageNotFound,
        }
    } else {
        ChatNotFound
    }
}
