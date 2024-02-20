use crate::{generate_query_call, generate_update_call};
use identity_canister::*;

// Queries
generate_query_call!(check_auth_principal);
generate_query_call!(get_delegation);

// Updates
generate_update_call!(create_identity);
generate_update_call!(migrate_legacy_principal);
generate_update_call!(prepare_delegation);

pub mod happy_path {
    use crate::rng::random_user_principal;
    use crate::User;
    use candid::Principal;
    use identity_canister::SignedDelegation;
    use pocket_ic::PocketIc;
    use types::{CanisterId, TimestampMillis};

    pub fn create_identity(
        env: &mut PocketIc,
        sender: Principal,
        identity_canister_id: CanisterId,
        public_key: Vec<u8>,
        session_key: Vec<u8>,
    ) -> identity_canister::create_identity::SuccessResult {
        let response = super::create_identity(
            env,
            sender,
            identity_canister_id,
            &identity_canister::create_identity::Args {
                public_key: ByteBuf::from(public_key),
                session_key: ByteBuf::from(session_key),
                max_time_to_live: None,
            },
        );

        match response {
            identity_canister::create_identity::Response::Success(result) => result,
            response => panic!("'create_identity' error: {response:?}"),
        }
    }

    pub fn prepare_delegation(
        env: &mut PocketIc,
        sender: Principal,
        identity_canister_id: CanisterId,
        session_key: Vec<u8>,
    ) -> identity_canister::prepare_delegation::SuccessResult {
        let response = super::prepare_delegation(
            env,
            sender,
            identity_canister_id,
            &identity_canister::prepare_delegation::Args {
                session_key: user.public_key.clone(),
                max_time_to_live: None,
            },
        );

        match response {
            identity_canister::prepare_delegation::Response::Success(result) => result,
            response => panic!("'prepare_delegation' error: {response:?}"),
        }
    }

    pub fn get_delegation(
        env: &PocketIc,
        sender: Principal,
        identity_canister_id: CanisterId,
        session_key: Vec<u8>,
        expiration: TimestampMillis,
    ) -> SignedDelegation {
        let response = super::get_delegation(
            env,
            sender,
            identity_canister_id,
            &identity_canister::get_delegation::Args {
                session_key: user.public_key.clone(),
                expiration,
            },
        );

        match response {
            identity_canister::get_delegation::Response::Success(signed_delegation) => signed_delegation,
            response => panic!("'get_delegation' error: {response:?}"),
        }
    }

    pub fn migrate_legacy_principal(env: &mut PocketIc, sender: Principal, identity_canister_id: CanisterId) -> Principal {
        let response = super::migrate_legacy_principal(
            env,
            sender,
            identity_canister_id,
            &identity_canister::migrate_legacy_principal::Args {},
        );

        match response {
            identity_canister::migrate_legacy_principal::Response::Success(result) => result.new_principal,
            response => panic!("'migrate_legacy_principal' error: {response:?}"),
        }
    }
}
