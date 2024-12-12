use crate::lifecycle::{init_cycles_dispenser_client, init_env, init_state};
use crate::memory::get_upgrades_memory;
use crate::Data;
use canister_logger::LogEntry;
use canister_tracing_macros::trace;
use ic_cdk::post_upgrade;
use stable_memory::get_reader;
use storage_index_canister::post_upgrade::Args;
use tracing::info;

#[post_upgrade]
#[trace]
fn post_upgrade(args: Args) {
    let memory = get_upgrades_memory();
    let reader = get_reader(&memory);

    let (mut data, errors, logs, traces): (Data, Vec<LogEntry>, Vec<LogEntry>, Vec<LogEntry>) =
        msgpack::deserialize(reader).unwrap();

    data.bucket_event_sync_queue.set_defer_processing(true);
    for bucket in data.buckets.iter_mut() {
        #[allow(deprecated)]
        data.bucket_event_sync_queue
            .push_many(bucket.canister_id, bucket.sync_state.take());
    }
    data.bucket_event_sync_queue.set_defer_processing(false);

    canister_logger::init_with_logs(data.test_mode, errors, logs, traces);

    let env = init_env(data.rng_seed);
    init_cycles_dispenser_client(
        data.cycles_dispenser_config.canister_id,
        data.cycles_dispenser_config.min_cycles_balance,
    );

    init_state(env, data, args.wasm_version);

    info!(version = %args.wasm_version, "Post-upgrade complete");
}
