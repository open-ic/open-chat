use crate::guards::caller_is_governance_principal;
use crate::read_state;
use canister_tracing_macros::trace;
use exchange_bot_canister::exchange::*;
use ic_cdk_macros::update;

#[update(guard = "caller_is_governance_principal")]
#[trace]
async fn exchange(args: Args) -> Response {
    let client = read_state(|state| state.get_icpswap_client());

    client
        .swap(args.amount, args.zero_for_one)
        .await
        .map_err(|e| format!("{e:?}"))
}
