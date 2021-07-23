use crate::canister::RUNTIME_STATE;
use crate::model::runtime_state::RuntimeState;
use candid::CandidType;
use ic_cdk_macros::update;
use serde::Deserialize;
use shared::types::Version;

#[derive(Deserialize)]
struct Args {
    #[serde(with = "serde_bytes")]
    user_wasm_module: Vec<u8>,
    version: Version,
}

#[derive(CandidType)]
enum Response {
    Success,
    NotAuthorized,
    VersionNotHigher,
}

#[update]
fn update_wasm(args: Args) -> Response {
    RUNTIME_STATE.with(|state| update_wasm_impl(args, state.borrow_mut().as_mut().unwrap()))
}

fn update_wasm_impl(args: Args, runtime_state: &mut RuntimeState) -> Response {
    let caller = runtime_state.env.caller();
    let permitted_callers = &runtime_state.data.service_principals;

    if !permitted_callers.contains(&caller) {
        return Response::NotAuthorized;
    }

    if args.version <= runtime_state.data.user_wasm.version {
        Response::VersionNotHigher
    } else {
        runtime_state.data.user_wasm.version = args.version;
        runtime_state.data.user_wasm.module = args.user_wasm_module;
        Response::Success
    }
}
