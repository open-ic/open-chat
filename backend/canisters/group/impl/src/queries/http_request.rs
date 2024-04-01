use crate::{read_state, RuntimeState};
use http_request::{build_json_response, encode_logs, extract_route, get_document, Route};
use ic_cdk_macros::query;
use types::{HttpRequest, HttpResponse, TimestampMillis};

#[query]
fn http_request(request: HttpRequest) -> HttpResponse {
    fn get_avatar_impl(requested_avatar_id: Option<u128>, state: &RuntimeState) -> HttpResponse {
        get_document(requested_avatar_id, &state.data.chat.avatar, "avatar")
    }

    fn get_logs_impl(since: Option<TimestampMillis>) -> HttpResponse {
        encode_logs(canister_logger::export_logs(), since.unwrap_or(0))
    }

    fn get_traces_impl(since: Option<TimestampMillis>) -> HttpResponse {
        encode_logs(canister_logger::export_traces(), since.unwrap_or(0))
    }

    fn get_metrics_impl(state: &RuntimeState) -> HttpResponse {
        build_json_response(&state.metrics())
    }

    fn get_timer_jobs(state: &RuntimeState) -> HttpResponse {
        let data: Vec<_> = if state.data.chat.is_public.value || state.data.test_mode {
            state
                .data
                .timer_jobs
                .iter()
                .filter_map(|(ts, wrapper)| wrapper.borrow().as_ref().map(|j| (*ts, j.clone())))
                .collect()
        } else {
            Vec::new()
        };

        build_json_response(&data)
    }

    match extract_route(&request.url) {
        Route::Avatar(requested_avatar_id) => read_state(|state| get_avatar_impl(requested_avatar_id, state)),
        Route::Logs(since) => get_logs_impl(since),
        Route::Traces(since) => get_traces_impl(since),
        Route::Metrics => read_state(get_metrics_impl),
        Route::Other(p, _) if p == "timer_jobs" => read_state(get_timer_jobs),
        _ => HttpResponse::not_found(),
    }
}
