use crate::jobs::import_groups::finalize_group_import;
use crate::lifecycle::{init_env, init_state};
use crate::memory::get_upgrades_memory;
use crate::model::events::CommunityEventInternal;
use crate::{mutate_state, read_state, Data};
use canister_logger::LogEntry;
use canister_tracing_macros::trace;
use chat_events::ChatEventInternal;
use community_canister::post_upgrade::Args;
use event_sink_client::EventBuilder;
use ic_cdk_macros::post_upgrade;
use instruction_counts_log::InstructionCountFunctionId;
use rand::Rng;
use stable_memory::get_reader;
use tracing::info;
use types::{Chat, MessageEventPayload, UsersBlocked};
use utils::consts::OPENCHAT_BOT_USER_ID;

#[post_upgrade]
#[trace]
fn post_upgrade(args: Args) {
    let memory = get_upgrades_memory();
    let reader = get_reader(&memory);

    let (data, logs, traces): (Data, Vec<LogEntry>, Vec<LogEntry>) = serializer::deserialize(reader).unwrap();

    canister_logger::init_with_logs(data.test_mode, logs, traces);

    let env = init_env(data.rng_seed);
    init_state(env, data, args.wasm_version);

    let completed_imports = read_state(|state| state.data.groups_being_imported.completed_imports());

    for group_id in completed_imports {
        finalize_group_import(group_id);
    }

    info!(version = %args.wasm_version, "Post-upgrade complete");

    read_state(|state| {
        let now = state.env.now();
        state
            .data
            .record_instructions_count(InstructionCountFunctionId::PostUpgrade, now)
    });

    mutate_state(|state| {
        let this_canister_id = state.env.canister_id();
        let community_id = this_canister_id.into();
        for channel in state.data.channels.iter_mut() {
            channel.chat.events.set_chat(Chat::Channel(community_id, channel.id));
            channel.chat.events.set_anonymized_id(state.env.rng().gen());

            let blocked: Vec<_> = channel.chat.members.blocked.iter().copied().collect();
            if !blocked.is_empty() {
                let now = state.env.now();
                let mut blocked_from_community = Vec::new();
                for user_id in blocked {
                    channel.chat.members.unblock(user_id, now);

                    if state.data.members.get_by_user_id(&user_id).is_none() {
                        state.data.members.block(user_id);
                        blocked_from_community.push(user_id);
                    }
                }
                if !blocked_from_community.is_empty() {
                    state.data.events.push_event(
                        CommunityEventInternal::UsersBlocked(Box::new(UsersBlocked {
                            user_ids: blocked_from_community,
                            blocked_by: OPENCHAT_BOT_USER_ID,
                        })),
                        now,
                    );
                }
            }
        }

        let source_string = this_canister_id.to_string();
        let proposals_bot_user_id = state.data.proposals_bot_user_id;
        let events_iter = state.data.channels.iter().flat_map(|c| {
            let anonymized_chat_id = c.chat.events.anonymized_id();
            let source_string_clone = source_string.clone();
            c.chat.events.iter_all_events().filter_map(move |(e, is_thread)| {
                if let ChatEventInternal::Message(m) = &e.event {
                    let is_proposals_bot = m.sender == proposals_bot_user_id;
                    Some(
                        EventBuilder::new("message_sent", e.timestamp)
                            .with_user(if is_proposals_bot { "ProposalsBot".to_string() } else { m.sender.to_string() })
                            .with_source(source_string_clone.clone())
                            .with_json_payload(&MessageEventPayload {
                                message_type: m.content.message_type(),
                                chat_type: "channel".to_string(),
                                chat_id: anonymized_chat_id.clone(),
                                thread: is_thread,
                                sender_is_bot: is_proposals_bot,
                                content_specific_payload: m.content.event_payload(),
                            })
                            .build(),
                    )
                } else {
                    None
                }
            })
        });

        state.data.event_sink_client.push_many(events_iter, false);
    });
}
