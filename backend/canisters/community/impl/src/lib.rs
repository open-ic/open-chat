use crate::model::groups::Groups;
use crate::model::members::Members;
use candid::Principal;
use canister_state_macros::canister_state;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use types::{Cycles, TimestampMillis, Timestamped, UserId, Version};
use utils::env::Environment;

mod guards;
mod jobs;
mod lifecycle;
mod memory;
mod model;
mod queries;
mod updates;

thread_local! {
    static WASM_VERSION: RefCell<Timestamped<Version>> = RefCell::default();
}

canister_state!(RuntimeState);

struct RuntimeState {
    pub env: Box<dyn Environment>,
    pub data: Data,
}

impl RuntimeState {
    pub fn new(env: Box<dyn Environment>, data: Data) -> RuntimeState {
        RuntimeState { env, data }
    }

    pub fn metrics(&self) -> Metrics {
        Metrics {
            memory_used: utils::memory::used(),
            now: self.env.now(),
            cycles_balance: self.env.cycles_balance(),
            wasm_version: WASM_VERSION.with(|v| **v.borrow()),
            git_commit_id: utils::git::git_commit_id().to_string(),
            canister_ids: CanisterIds {},
        }
    }
}

#[derive(Serialize, Deserialize)]
struct Data {
    members: Members,
    groups: Groups,
    test_mode: bool,
}

impl Data {
    fn new(created_by_principal: Principal, created_by_user_id: UserId, test_mode: bool, now: TimestampMillis) -> Data {
        let members = Members::new(created_by_principal, created_by_user_id, now);

        Data {
            members,
            groups: Groups::default(),
            test_mode,
        }
    }
}

#[derive(Serialize, Debug)]
pub struct Metrics {
    pub memory_used: u64,
    pub now: TimestampMillis,
    pub cycles_balance: Cycles,
    pub wasm_version: Version,
    pub git_commit_id: String,
    pub canister_ids: CanisterIds,
}

#[derive(Serialize, Debug)]
pub struct CanisterIds {}
