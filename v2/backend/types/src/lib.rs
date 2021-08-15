use candid::Principal;

mod canister_wasm;
mod chat_id;
mod chat_summary;
mod confirmation_code_sms;
mod event_index;
mod event_wrapper;
mod events;
mod indexed_event;
mod message;
mod message_content;
mod message_id;
mod message_index;
mod notifications;
mod participant;
mod reply_context;
mod role;
mod subscription;
mod user_id;
mod user_summary;
mod version;

pub use canister_wasm::*;
pub use chat_id::*;
pub use chat_summary::*;
pub use confirmation_code_sms::*;
pub use event_index::*;
pub use event_wrapper::*;
pub use events::*;
pub use indexed_event::*;
pub use message::*;
pub use message_content::*;
pub use message_id::*;
pub use message_index::*;
pub use notifications::*;
pub use participant::*;
pub use reply_context::*;
pub use role::*;
pub use subscription::*;
pub use user_id::*;
pub use user_summary::*;
pub use version::*;

#[cfg(feature = "phonenumber")]
mod user;

#[cfg(feature = "phonenumber")]
pub use user::*;

pub mod v1_message;

pub type CanisterId = Principal;
pub type Milliseconds = u64;
pub type TimestampMillis = u64;
pub type TimestampNanos = u64;
