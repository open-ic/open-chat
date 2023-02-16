use crate::guards::caller_is_governance_principal;
use crate::{mutate_state, read_state, RuntimeState};
use canister_api_macros::proposal;
use canister_tracing_macros::trace;
use ic_cdk::api::call::CallResult;
use std::collections::HashMap;
use tracing::info;
use types::{CanisterId, CanisterWasm, UpgradeCanisterWasmArgs};
use user_index_canister::upgrade_user_canister_wasm::{Response::*, *};

#[proposal(guard = "caller_is_governance_principal")]
#[trace]
async fn upgrade_user_canister_wasm(args: Args) -> Response {
    let version = args.wasm.version;
    let use_for_new_canisters = args.use_for_new_canisters.unwrap_or(true);

    let PrepareResult {
        wasm,
        local_user_index_canisters,
    } = match read_state(|state| prepare(args, state)) {
        Ok(ok) => ok,
        Err(response) => return response,
    };

    let futures: Vec<_> = local_user_index_canisters
        .into_iter()
        .map(|(canister_id, filter)| {
            c2c_upgrade_user_canister_wasm(
                canister_id,
                UpgradeCanisterWasmArgs {
                    wasm: wasm.clone(),
                    include: Some(filter.include),
                    exclude: Some(filter.exclude),
                    use_for_new_canisters: Some(use_for_new_canisters),
                },
            )
        })
        .collect();

    let result = futures::future::join_all(futures).await;

    if let Some(first_error) = result.into_iter().filter_map(|res| res.err()).next() {
        InternalError(format!("{first_error:?}"))
    } else {
        if use_for_new_canisters {
            mutate_state(|state| {
                state.data.user_canister_wasm = wasm;
            });
        }

        info!(%version, "User canister wasm upgraded");
        Success
    }
}

struct PrepareResult {
    wasm: CanisterWasm,
    local_user_index_canisters: Vec<(CanisterId, Filter)>,
}

fn prepare(args: Args, runtime_state: &RuntimeState) -> Result<PrepareResult, Response> {
    if !runtime_state.data.test_mode && args.wasm.version < runtime_state.data.user_canister_wasm.version {
        return Err(VersionNotHigher);
    }

    let local_user_index_canister_ids: Vec<_> = runtime_state.data.local_index_map.canisters().copied().collect();

    let mut map: HashMap<CanisterId, Filter> = HashMap::new();

    let include = args.include.unwrap_or_default();
    let include_all = include.is_empty();
    let exclude = args.exclude.unwrap_or_default();

    if include_all {
        for canister_id in local_user_index_canister_ids {
            map.insert(canister_id, Filter::default());
        }
    } else {
        for canister_id in include {
            if local_user_index_canister_ids.contains(&canister_id) {
                map.entry(canister_id).or_default();
            } else if let Some(index) = runtime_state.data.local_index_map.get_index_canister(&canister_id.into()) {
                map.entry(index).or_default().include.push(canister_id);
            }
        }
    }

    for canister_id in exclude {
        // If the index canister is in the map, remove it
        if !map.remove(&canister_id) {
            // Else, find the relevant index canister and add to its exclusion list
            if let Some(index) = runtime_state.data.local_index_map.get_index_canister(&canister_id.into()) {
                map.entry(index).and_modify(|e| e.exclude.push(canister_id));
            }
        }
    }

    Ok(PrepareResult {
        wasm: args.wasm,
        local_user_index_canisters: map.into_iter().collect(),
    })
}

async fn c2c_upgrade_user_canister_wasm(
    canister_id: CanisterId,
    args: local_user_index_canister::c2c_upgrade_user_canister_wasm::Args,
) -> CallResult<local_user_index_canister::c2c_upgrade_user_canister_wasm::Response> {
    local_user_index_canister_c2c_client::c2c_upgrade_user_canister_wasm(canister_id, &args).await
}

#[derive(Default)]
struct Filter {
    include: Vec<CanisterId>,
    exclude: Vec<CanisterId>,
}
