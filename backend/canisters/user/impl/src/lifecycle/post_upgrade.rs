use crate::lifecycle::{init_logger, init_state, UPGRADE_BUFFER_SIZE};
use crate::{mutate_state, openchat_bot, Data, LOG_MESSAGES};
use canister_logger::{LogMessage, LogMessagesWrapper};
use canister_tracing_macros::trace;
use ic_cdk_macros::post_upgrade;
use stable_memory::deserialize_from_stable_memory;
use tracing::info;
use user_canister::post_upgrade::Args;
use utils::env::canister::CanisterEnv;

#[post_upgrade]
#[trace]
fn post_upgrade(args: Args) {
    ic_cdk::setup();

    let env = Box::new(CanisterEnv::new());

    let (mut data, log_messages, trace_messages): (Data, Vec<LogMessage>, Vec<LogMessage>) =
        deserialize_from_stable_memory(UPGRADE_BUFFER_SIZE).unwrap();

    data.direct_chats.recalculate_messages_deleted();

    init_logger(data.test_mode);
    init_state(env, data, args.wasm_version);

    if !log_messages.is_empty() || !trace_messages.is_empty() {
        LOG_MESSAGES.with(|l| rehydrate_log_messages(log_messages, trace_messages, &l.borrow()))
    }

    if args.eligible_for_sns1_airdrop {
        mutate_state(openchat_bot::send_sns1_airdrop_message);
    }

    info!(version = %args.wasm_version, "Post-upgrade complete");
}

fn rehydrate_log_messages(
    log_messages: Vec<LogMessage>,
    trace_messages: Vec<LogMessage>,
    messages_container: &LogMessagesWrapper,
) {
    for message in log_messages {
        messages_container.logs.push(message);
    }

    for message in trace_messages {
        messages_container.traces.push(message);
    }
}
