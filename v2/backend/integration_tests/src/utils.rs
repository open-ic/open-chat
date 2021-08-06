use crate::types::{CanisterWasm, Version};
use candid::Principal;
use ic_agent::agent::http_transport::ReqwestHttpReplicaV2Transport;
use ic_agent::identity::BasicIdentity;
use ic_agent::Agent;
use ic_utils::interfaces::ManagementCanister;
use ic_utils::Canister;
use std::fs::File;
use std::future::Future;
use std::io::Read;
use std::path::PathBuf;
use tokio::runtime::Runtime as TRuntime;

const CONTROLLER_PEM: &str = include_str!("../keys/controller.pem");
const USER1_PEM: &str = include_str!("../keys/user1.pem");
const USER2_PEM: &str = include_str!("../keys/user2.pem");
const USER3_PEM: &str = include_str!("../keys/user3.pem");

#[allow(dead_code)]
pub enum TestIdentity {
    Controller,
    User1,
    User2,
    User3,
}

pub enum CanisterWasmName {
    Group,
    GroupIndex,
    Notifications,
    User,
    UserIndex,
}

pub fn build_identity(identity: TestIdentity) -> BasicIdentity {
    let pem = match identity {
        TestIdentity::Controller => CONTROLLER_PEM,
        TestIdentity::User1 => USER1_PEM,
        TestIdentity::User2 => USER2_PEM,
        TestIdentity::User3 => USER3_PEM,
    };

    BasicIdentity::from_pem(pem.as_bytes()).expect("Failed to create identity")
}

pub async fn build_ic_agent(url: String, identity: BasicIdentity) -> Agent {
    let transport = ReqwestHttpReplicaV2Transport::create(url).expect("Failed to create Reqwest transport");
    let timeout = std::time::Duration::from_secs(60 * 5);

    let agent = Agent::builder()
        .with_transport(transport)
        .with_identity(identity)
        .with_ingress_expiry(Some(timeout))
        .build()
        .expect("Failed to build IC agent");

    agent.fetch_root_key().await.expect("Couldn't fetch root key");

    agent
}

pub fn build_management_canister(agent: &Agent) -> Canister<ManagementCanister> {
    Canister::builder()
        .with_agent(agent)
        .with_canister_id(Principal::management_canister())
        .with_interface(ManagementCanister)
        .build()
        .unwrap()
}

pub fn get_canister_wasm(canister_name: CanisterWasmName) -> CanisterWasm {
    let file_name_prefix = match canister_name {
        CanisterWasmName::Group => "group",
        CanisterWasmName::GroupIndex => "group_index",
        CanisterWasmName::Notifications => "notifications",
        CanisterWasmName::User => "user",
        CanisterWasmName::UserIndex => "user_index",
    };
    let file_name = file_name_prefix.to_string() + "_canister_impl-opt.wasm";
    let mut file_path =
        PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").expect("Failed to read CARGO_MANIFEST_DIR env variable"));
    file_path.push("local-bin");
    file_path.push(&file_name);

    let mut file = File::open(&file_path).unwrap_or_else(|_| panic!("Failed to open file: {}", file_path.to_str().unwrap()));
    let mut bytes = Vec::new();
    file.read_to_end(&mut bytes).expect("Failed to read file");

    CanisterWasm {
        module: bytes,
        version: Version::new(0, 0, 0),
    }
}

// How `Agent` is instructed to wait for update calls.
pub fn delay() -> garcon::Delay {
    garcon::Delay::builder()
        .throttle(std::time::Duration::from_millis(500))
        .timeout(std::time::Duration::from_secs(60 * 5))
        .build()
}

pub fn block_on<F: Future>(f: F) -> F::Output {
    let rt = TRuntime::new().unwrap_or_else(|err| panic!("Could not create tokio runtime: {}", err));
    rt.block_on(f)
}
