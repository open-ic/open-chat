use candid_gen::generate_candid_method;
use std::env;
use ts_export::generate_ts_method;

#[allow(deprecated)]
fn main() {
    generate_candid_method!(community, channel_summary_updates, query);
    generate_candid_method!(community, channel_summary, query);
    generate_candid_method!(community, deleted_message, query);
    generate_candid_method!(community, events_by_index, query);
    generate_candid_method!(community, events_window, query);
    generate_candid_method!(community, events, query);
    generate_candid_method!(community, explore_channels, query);
    generate_candid_method!(community, invite_code, query);
    generate_candid_method!(community, local_user_index, query);
    generate_candid_method!(community, lookup_members, query);
    generate_candid_method!(community, messages_by_message_index, query);
    generate_candid_method!(community, search_channel, query);
    generate_candid_method!(community, selected_channel_initial, query);
    generate_candid_method!(community, selected_channel_updates_v2, query);
    generate_candid_method!(community, selected_initial, query);
    generate_candid_method!(community, selected_updates_v2, query);
    generate_candid_method!(community, summary, query);
    generate_candid_method!(community, summary_updates, query);
    generate_candid_method!(community, thread_previews, query);
    generate_candid_method!(community, video_call_participants, query);

    generate_candid_method!(community, accept_p2p_swap, update);
    generate_candid_method!(community, add_members_to_channel, update);
    generate_candid_method!(community, add_reaction, update);
    generate_candid_method!(community, block_user, update);
    generate_candid_method!(community, cancel_p2p_swap, update);
    generate_candid_method!(community, cancel_invites, update);
    generate_candid_method!(community, change_channel_role, update);
    generate_candid_method!(community, change_role, update);
    generate_candid_method!(community, claim_prize, update);
    generate_candid_method!(community, create_channel, update);
    generate_candid_method!(community, create_user_group, update);
    generate_candid_method!(community, decline_invitation, update);
    generate_candid_method!(community, delete_channel, update);
    generate_candid_method!(community, delete_messages, update);
    generate_candid_method!(community, delete_user_groups, update);
    generate_candid_method!(community, disable_invite_code, update);
    generate_candid_method!(community, edit_message, update);
    generate_candid_method!(community, enable_invite_code, update);
    generate_candid_method!(community, end_video_call_v2, update);
    generate_candid_method!(community, follow_thread, update);
    generate_candid_method!(community, import_group, update);
    generate_candid_method!(community, join_video_call, update);
    generate_candid_method!(community, leave_channel, update);
    generate_candid_method!(community, pin_message, update);
    generate_candid_method!(community, register_poll_vote, update);
    generate_candid_method!(community, register_proposal_vote, update);
    // generate_candid_method!(community, register_proposal_vote_v2, update);
    generate_candid_method!(community, remove_member_from_channel, update);
    generate_candid_method!(community, remove_member, update);
    generate_candid_method!(community, remove_reaction, update);
    generate_candid_method!(community, report_message, update);
    generate_candid_method!(community, reset_invite_code, update);
    generate_candid_method!(community, send_message, update);
    generate_candid_method!(community, set_member_display_name, update);
    generate_candid_method!(community, set_video_call_presence, update);
    generate_candid_method!(community, start_video_call_v2, update);
    generate_candid_method!(community, toggle_mute_notifications, update);
    generate_candid_method!(community, unblock_user, update);
    generate_candid_method!(community, undelete_messages, update);
    generate_candid_method!(community, unfollow_thread, update);
    generate_candid_method!(community, unpin_message, update);
    generate_candid_method!(community, update_channel, update);
    generate_candid_method!(community, update_community, update);
    generate_candid_method!(community, update_user_group, update);

    let directory = env::current_dir().unwrap().join("tsBindings/community");
    if directory.exists() {
        std::fs::remove_dir_all(&directory).unwrap();
    }

    generate_ts_method!(community, channel_summary_updates);
    generate_ts_method!(community, channel_summary);
    generate_ts_method!(community, deleted_message);
    generate_ts_method!(community, events_by_index);
    generate_ts_method!(community, events_window);
    generate_ts_method!(community, events);
    generate_ts_method!(community, explore_channels);
    generate_ts_method!(community, invite_code);
    generate_ts_method!(community, local_user_index);
    generate_ts_method!(community, lookup_members);
    generate_ts_method!(community, messages_by_message_index);
    generate_ts_method!(community, search_channel);
    generate_ts_method!(community, selected_channel_initial);
    generate_ts_method!(community, selected_channel_updates_v2);
    generate_ts_method!(community, selected_initial);
    generate_ts_method!(community, selected_updates_v2);
    generate_ts_method!(community, summary);
    generate_ts_method!(community, summary_updates);
    generate_ts_method!(community, thread_previews);
    generate_ts_method!(community, video_call_participants);

    generate_ts_method!(community, accept_p2p_swap);
    generate_ts_method!(community, add_members_to_channel);
    generate_ts_method!(community, add_reaction);
    generate_ts_method!(community, block_user);
    generate_ts_method!(community, cancel_p2p_swap);
    generate_ts_method!(community, cancel_invites);
    generate_ts_method!(community, change_channel_role);
    generate_ts_method!(community, change_role);
    generate_ts_method!(community, claim_prize);
    generate_ts_method!(community, create_channel);
    generate_ts_method!(community, create_user_group);
    generate_ts_method!(community, decline_invitation);
    generate_ts_method!(community, delete_channel);
    generate_ts_method!(community, delete_messages);
    generate_ts_method!(community, delete_user_groups);
    generate_ts_method!(community, disable_invite_code);
    generate_ts_method!(community, edit_message);
    generate_ts_method!(community, enable_invite_code);
    generate_ts_method!(community, follow_thread);
    generate_ts_method!(community, import_group);
    generate_ts_method!(community, join_video_call);
    generate_ts_method!(community, leave_channel);
    generate_ts_method!(community, pin_message);
    generate_ts_method!(community, register_poll_vote);
    generate_ts_method!(community, register_proposal_vote);
    generate_ts_method!(community, register_proposal_vote_v2);
    generate_ts_method!(community, remove_member_from_channel);
    generate_ts_method!(community, remove_member);
    generate_ts_method!(community, remove_reaction);
    generate_ts_method!(community, report_message);
    generate_ts_method!(community, reset_invite_code);
    generate_ts_method!(community, send_message);
    generate_ts_method!(community, set_member_display_name);
    generate_ts_method!(community, set_video_call_presence);
    generate_ts_method!(community, toggle_mute_notifications);
    generate_ts_method!(community, unblock_user);
    generate_ts_method!(community, undelete_messages);
    generate_ts_method!(community, unfollow_thread);
    generate_ts_method!(community, unpin_message);
    generate_ts_method!(community, update_bot);
    generate_ts_method!(community, update_channel);
    generate_ts_method!(community, update_community);
    generate_ts_method!(community, update_user_group);

    candid::export_service!();
    std::print!("{}", __export_service());
}
