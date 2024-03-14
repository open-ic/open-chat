use crate::lifecycle::{init_env, init_state};
use crate::memory::get_upgrades_memory;
use crate::timer_job_types::{ProcessTokenSwapJob, TimerJob};
use crate::{mutate_state, Data, RuntimeState};
use canister_logger::LogEntry;
use canister_tracing_macros::trace;
use chat_events::{ChatEventInternal, MessageContentInternal};
use event_store_producer::{Event, EventBuilder};
use ic_cdk_macros::post_upgrade;
use stable_memory::get_reader;
use std::collections::HashMap;
use tracing::info;
use types::{
    CanisterId, MessageEditedEventPayload, MessageTippedEventPayload, P2PSwapCompletedEventPayload, P2PSwapStatus,
    ReactionAddedEventPayload, UserId, VideoCallEndedEventPayload,
};
use user_canister::post_upgrade::Args;

#[post_upgrade]
#[trace]
fn post_upgrade(args: Args) {
    let memory = get_upgrades_memory();
    let reader = get_reader(&memory);

    let (data, logs, traces): (Data, Vec<LogEntry>, Vec<LogEntry>) = serializer::deserialize(reader).unwrap();

    canister_logger::init_with_logs(data.test_mode, logs, traces);

    let env = init_env(data.rng_seed);
    init_state(env, data, args.wasm_version);

    info!(version = %args.wasm_version, "Post-upgrade complete");

    let token_lookup: HashMap<_, _> = vec![
        (CanisterId::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap(), "ICP"),
        (CanisterId::from_text("zfcdd-tqaaa-aaaaq-aaaga-cai").unwrap(), "DKP"),
        (CanisterId::from_text("2ouva-viaaa-aaaaq-aaamq-cai").unwrap(), "CHAT"),
        (CanisterId::from_text("73mez-iiaaa-aaaaq-aaasq-cai").unwrap(), "KINIC"),
        (CanisterId::from_text("6rdgd-kyaaa-aaaaq-aaavq-cai").unwrap(), "HOT"),
        (CanisterId::from_text("4c4fd-caaaa-aaaaq-aaa3a-cai").unwrap(), "GHOST"),
        (CanisterId::from_text("mxzaz-hqaaa-aaaar-qaada-cai").unwrap(), "ckBTC"),
        (CanisterId::from_text("xsi2v-cyaaa-aaaaq-aabfq-cai").unwrap(), "MOD"),
        (CanisterId::from_text("uf2wh-taaaa-aaaaq-aabna-cai").unwrap(), "CAT"),
        (CanisterId::from_text("vtrom-gqaaa-aaaaq-aabia-cai").unwrap(), "BOOM"),
        (CanisterId::from_text("rffwt-piaaa-aaaaq-aabqq-cai").unwrap(), "ICX"),
        (CanisterId::from_text("rxdbk-dyaaa-aaaaq-aabtq-cai").unwrap(), "NUA"),
        (CanisterId::from_text("qbizb-wiaaa-aaaaq-aabwq-cai").unwrap(), "SONIC"),
        (CanisterId::from_text("6qfxa-ryaaa-aaaai-qbhsq-cai").unwrap(), "TAGGR"),
        (CanisterId::from_text("rh2pm-ryaaa-aaaan-qeniq-cai").unwrap(), "EXE"),
        (CanisterId::from_text("ss2fx-dyaaa-aaaar-qacoq-cai").unwrap(), "ckETH"),
        (CanisterId::from_text("iozql-7iaaa-aaaah-advvq-cai").unwrap(), "TENDY"),
        (CanisterId::from_text("emww2-4yaaa-aaaaq-aacbq-cai").unwrap(), "TRAX"),
        (CanisterId::from_text("f54if-eqaaa-aaaaq-aacea-cai").unwrap(), "NTN"),
        (CanisterId::from_text("tyyy3-4aaaa-aaaaq-aab7a-cai").unwrap(), "GLDGov"),
        (CanisterId::from_text("ifnqy-rqaaa-aaaak-afhmq-cai").unwrap(), "ICPI"),
        (CanisterId::from_text("pcj6u-uaaaa-aaaak-aewnq-cai").unwrap(), "CLOUD"),
        (CanisterId::from_text("3kf65-giaaa-aaaak-qcw2q-cai").unwrap(), "AVCD"),
        (CanisterId::from_text("7tx3o-zyaaa-aaaak-aes6q-cai").unwrap(), "DOGMI"),
        (CanisterId::from_text("uxr6i-cyaaa-aaaar-qacyq-cai").unwrap(), "TTS"),
        (CanisterId::from_text("wnnwu-4iaaa-aaaar-qacxq-cai").unwrap(), "SKIBIDI"),
        (CanisterId::from_text("vpyll-myaaa-aaaar-qac4q-cai").unwrap(), "HAR"),
        (CanisterId::from_text("jwcfb-hyaaa-aaaaj-aac4q-cai").unwrap(), "OGY"),
        (CanisterId::from_text("edypu-bqaaa-aaaak-afknq-cai").unwrap(), "BITCORN"),
        (CanisterId::from_text("hvgxa-wqaaa-aaaaq-aacia-cai").unwrap(), "SNEED"),
        (CanisterId::from_text("uwihq-liaaa-aaaal-qcbrq-cai").unwrap(), "NOBL"),
        (CanisterId::from_text("ek3ei-xyaaa-aaaak-afkma-cai").unwrap(), "DIZNI"),
    ]
    .into_iter()
    .collect();

    mutate_state(|state| {
        let dragginz_ledger = CanisterId::from_text("zfcdd-tqaaa-aaaaq-aaaga-cai").unwrap();
        for swap in state.data.token_swaps.iter_mut().filter(|s| {
            s.args.output_token.ledger == dragginz_ledger
                && s.args.output_token.fee == 1000
                && s.withdrawn_from_dex_at.as_ref().is_some_and(|r| r.is_err())
        }) {
            let now = state.env.now();
            swap.args.output_token.fee = 100000;
            swap.withdrawn_from_dex_at = None;

            state.data.timer_jobs.enqueue_job(
                TimerJob::ProcessTokenSwap(Box::new(ProcessTokenSwapJob {
                    token_swap: swap.clone(),
                    attempt: 0,
                })),
                now,
                now,
            );
        }
      
        let events = extract_events(state, &token_lookup);
        state.data.event_store_client.push_many(events.into_iter(), false);
    });
}

fn extract_events(state: &RuntimeState, token_lookup: &HashMap<CanisterId, &str>) -> Vec<Event> {
    let my_user_id: UserId = state.env.canister_id().into();
    let user_string = my_user_id.to_string();

    state
        .data
        .direct_chats
        .iter()
        .flat_map(|c| {
            let anonymized_chat_id = c.events.anonymized_id.clone();
            let user_string_clone = user_string.clone();
            c.events.iter_all_events().flat_map(move |(e, is_thread)| {
                let mut events = Vec::new();
                if let ChatEventInternal::Message(m) = &e.event {
                    for (ledger, tips) in m.tips.iter() {
                        let token = token_lookup.get(ledger).unwrap();
                        if let Some(amount) = tips.iter().find(|(u, _)| *u == my_user_id).map(|(_, a)| *a) {
                            events.push(
                                EventBuilder::new("message_tipped", e.timestamp)
                                    .with_user(user_string_clone.clone())
                                    .with_source(user_string_clone.clone())
                                    .with_json_payload(&MessageTippedEventPayload {
                                        message_type: m.content.message_type(),
                                        chat_type: "direct".to_string(),
                                        chat_id: anonymized_chat_id.clone(),
                                        thread: is_thread,
                                        token: token.to_string(),
                                        amount,
                                    })
                                    .build(),
                            );
                        }
                    }

                    for (_, user_ids) in m.reactions.iter() {
                        if user_ids.contains(&my_user_id) {
                            events.push(
                                EventBuilder::new("reaction_added", e.timestamp)
                                    .with_user(user_string_clone.clone())
                                    .with_source(user_string_clone.clone())
                                    .with_json_payload(&ReactionAddedEventPayload {
                                        message_type: m.content.message_type(),
                                        chat_type: "direct".to_string(),
                                        chat_id: anonymized_chat_id.clone(),
                                        thread: is_thread,
                                    })
                                    .build(),
                            );
                        }
                    }

                    if m.sender == my_user_id {
                        if m.last_edited.is_some() {
                            events.push(
                                EventBuilder::new("message_edited", e.timestamp)
                                    .with_user(user_string_clone.clone())
                                    .with_source(user_string_clone.clone())
                                    .with_json_payload(&MessageEditedEventPayload {
                                        message_type: m.content.message_type(),
                                        chat_type: "direct".to_string(),
                                        chat_id: anonymized_chat_id.clone(),
                                        thread: is_thread,
                                        already_edited: false, // We can't determine this
                                        old_length: 0,         // We can't determine this
                                        new_length: m.content.text_length(),
                                    })
                                    .build(),
                            );
                        }

                        if let MessageContentInternal::VideoCall(video) = &m.content {
                            if let Some(ts) = video.ended {
                                events.push(
                                    EventBuilder::new("video_call_ended", e.timestamp)
                                        .with_source(user_string_clone.clone())
                                        .with_json_payload(&VideoCallEndedEventPayload {
                                            chat_type: "direct".to_string(),
                                            chat_id: anonymized_chat_id.clone(),
                                            participants: video.participants.len() as u32,
                                            duration_secs: (ts.saturating_sub(e.timestamp) / 1000) as u32,
                                        })
                                        .build(),
                                );
                            }
                        }
                    } else if let MessageContentInternal::P2PSwap(swap) = &m.content {
                        if matches!(swap.status, P2PSwapStatus::Completed(_)) {
                            events.push(
                                EventBuilder::new("p2p_swap_completed", e.timestamp)
                                    .with_user(user_string_clone.clone())
                                    .with_source(user_string_clone.clone())
                                    .with_json_payload(&P2PSwapCompletedEventPayload {
                                        token0: swap.token0.token.token_symbol().to_string(),
                                        token0_amount: swap.token0_amount,
                                        token1: swap.token1.token.token_symbol().to_string(),
                                        token1_amount: swap.token1_amount,
                                        chat_type: "direct".to_string(),
                                        chat_id: anonymized_chat_id.clone(),
                                    })
                                    .build(),
                            );
                        }
                    }
                }
                events
            })
        })
        .collect()
}
