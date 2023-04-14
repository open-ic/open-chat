use crate::RuntimeState;

pub mod distribute_airdrop_neurons;
pub mod finalize_initial_airdrop;
pub mod make_pending_payments;
pub mod notify_user_principal_migrations;
pub mod sync_events_to_local_user_index_canisters;
pub mod sync_users_to_storage_index;
pub mod upgrade_canisters;

pub(crate) fn start(runtime_state: &RuntimeState) {
    distribute_airdrop_neurons::start_job_if_required(runtime_state);
    finalize_initial_airdrop::start_job_if_required(runtime_state);
    notify_user_principal_migrations::start_job_if_required(runtime_state);
    sync_events_to_local_user_index_canisters::start_job_if_required(runtime_state);
    sync_users_to_storage_index::start_job_if_required(runtime_state);
    upgrade_canisters::start_job_if_required(runtime_state);
    make_pending_payments::start_job_if_required(runtime_state);
}
