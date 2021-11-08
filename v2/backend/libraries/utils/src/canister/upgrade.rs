use crate::canister;
use candid::{CandidType, Principal};
use ic_cdk::api;
use ic_cdk::api::call::CallResult;
use serde::Deserialize;
use tracing::error;
use types::{CanisterId, CanisterWasm, Version};

pub struct CanisterToUpgrade {
    pub canister_id: CanisterId,
    pub current_wasm_version: Version,
    pub new_wasm: CanisterWasm,
}

pub async fn upgrade(canister_id: CanisterId, wasm_module: Vec<u8>) -> Result<(), canister::Error> {
    #[derive(CandidType, Deserialize)]
    struct StartOrStopCanisterArgs {
        canister_id: Principal,
    }

    #[derive(CandidType, Deserialize)]
    enum InstallMode {
        #[serde(rename = "install")]
        Install,
        #[serde(rename = "reinstall")]
        Reinstall,
        #[serde(rename = "upgrade")]
        Upgrade,
    }

    #[derive(CandidType, Deserialize)]
    struct CanisterInstall {
        mode: InstallMode,
        canister_id: Principal,
        #[serde(with = "serde_bytes")]
        wasm_module: Vec<u8>,
        #[serde(with = "serde_bytes")]
        arg: Vec<u8>,
    }

    let stop_canister_args = StartOrStopCanisterArgs { canister_id };
    let stop_canister_response: CallResult<()> = api::call::call(Principal::management_canister(), "stop_canister", (stop_canister_args,)).await;
    if let Err((code, msg)) = stop_canister_response {
        let code = code as u8;
        error!(error_code = code, error_message = msg.as_str(), "Error calling 'stop_canister'");
        return Err(canister::Error { code, msg });
    }

    let install_code_args = CanisterInstall {
        mode: InstallMode::Upgrade,
        canister_id,
        wasm_module,
        arg: b" ".to_vec(),
    };
    let install_code_response: CallResult<()> = api::call::call(Principal::management_canister(), "install_code", (install_code_args,)).await;

    // Call 'start canister' regardless of if 'install_code' succeeded or not.
    let start_canister_args = StartOrStopCanisterArgs { canister_id };
    let start_canister_response: CallResult<()> = api::call::call(Principal::management_canister(), "start_canister", (start_canister_args,)).await;

    if let Err((code, msg)) = install_code_response {
        let code = code as u8;
        error!(error_code = code, error_message = msg.as_str(), "Error calling 'install_code'");
        return Err(canister::Error { code, msg });
    }

    if let Err((code, msg)) = start_canister_response {
        let code = code as u8;
        error!(error_code = code, error_message = msg.as_str(), "Error calling 'start_canister'");
        return Err(canister::Error { code, msg });
    }

    Ok(())
}
