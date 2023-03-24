use crate::T;
use candid::{CandidType, Principal};
use ic_cdk::api::management_canister::main::{CanisterInstallMode, InstallCodeArgument};
use ic_test_state_machine_client::{StateMachine, UserError, WasmResult};
use serde::de::DeserializeOwned;
use types::{CanisterId, CanisterWasm};

mod macros;

pub mod cycles_dispenser;
pub mod group;
pub mod group_index;
pub mod icrc1;
pub mod local_user_index;
pub mod notifications;
pub mod notifications_index;
pub mod online_users;
pub mod storage_bucket;
pub mod storage_index;
pub mod user;
pub mod user_index;

const INIT_CYCLES_BALANCE: u128 = 1_000 * T;

pub fn create_canister(env: &mut StateMachine, controller: Principal) -> CanisterId {
    let canister_id = env.create_canister_with_settings(None, Some(controller));
    env.add_cycles(canister_id, INIT_CYCLES_BALANCE);
    canister_id
}

pub fn start_canister(env: &mut StateMachine, sender: Principal, canister_id: CanisterId) {
    env.update_call(
        Principal::management_canister(),
        sender,
        "start_canister",
        candid::encode_one(StartStopArgs::new(canister_id)).unwrap(),
    )
    .unwrap();
}

pub fn stop_canister(env: &mut StateMachine, sender: Principal, canister_id: CanisterId) {
    env.update_call(
        Principal::management_canister(),
        sender,
        "stop_canister",
        candid::encode_one(StartStopArgs::new(canister_id)).unwrap(),
    )
    .unwrap();
}

pub fn install_canister<P: CandidType>(
    env: &mut StateMachine,
    sender: Principal,
    canister_id: CanisterId,
    wasm: CanisterWasm,
    payload: P,
) {
    execute_update(
        env,
        sender,
        Principal::management_canister(),
        "install_code",
        &InstallCodeArgument {
            mode: CanisterInstallMode::Install,
            canister_id,
            wasm_module: wasm.module,
            arg: candid::encode_one(&payload).unwrap(),
        },
    )
}

pub fn execute_query<P: CandidType, R: CandidType + DeserializeOwned>(
    env: &StateMachine,
    sender: Principal,
    canister_id: CanisterId,
    method_name: &str,
    payload: &P,
) -> R {
    unwrap_response(env.query_call(canister_id, sender, method_name, candid::encode_one(payload).unwrap()))
}

pub fn execute_update<P: CandidType, R: CandidType + DeserializeOwned>(
    env: &mut StateMachine,
    sender: Principal,
    canister_id: CanisterId,
    method_name: &str,
    payload: &P,
) -> R {
    unwrap_response(env.update_call(canister_id, sender, method_name, candid::encode_one(payload).unwrap()))
}

fn unwrap_response<R: CandidType + DeserializeOwned>(response: Result<WasmResult, UserError>) -> R {
    match response.unwrap() {
        WasmResult::Reply(bytes) => candid::decode_one(&bytes).unwrap(),
        WasmResult::Reject(error) => panic!("{error}"),
    }
}

#[derive(CandidType)]
struct StartStopArgs {
    canister_id: CanisterId,
}

impl StartStopArgs {
    fn new(canister_id: CanisterId) -> StartStopArgs {
        StartStopArgs { canister_id }
    }
}
