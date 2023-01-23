use crate::Version;
use candid::CandidType;
use human_readable::{HumanReadable, ToHumanReadable};
use serde::{Deserialize, Serialize};
use sha256::sha256_string;
use std::fmt::{Debug, Formatter};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UpgradeCanisterWasmArgs {
    pub wasm: HumanReadable<CanisterWasm>,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct CanisterWasm {
    pub version: Version,
    #[serde(with = "serde_bytes")]
    pub module: Vec<u8>,
}

impl Default for CanisterWasm {
    fn default() -> Self {
        CanisterWasm {
            version: Version::new(0, 0, 0),
            module: Vec::default(),
        }
    }
}

impl Debug for CanisterWasm {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("CanisterWasm")
            .field("version", &self.version)
            .field("byte_length", &self.module.len())
            .finish()
    }
}

impl ToHumanReadable for CanisterWasm {
    type Target = CanisterWasmTrimmed;

    fn to_human_readable(&self) -> Self::Target {
        self.into()
    }
}

#[derive(Serialize)]
pub struct CanisterWasmTrimmed {
    version: Version,
    module_hash: String,
    byte_length: u64,
}

impl From<&CanisterWasm> for CanisterWasmTrimmed {
    fn from(value: &CanisterWasm) -> Self {
        CanisterWasmTrimmed {
            version: value.version,
            module_hash: sha256_string(&value.module),
            byte_length: value.module.len() as u64,
        }
    }
}
