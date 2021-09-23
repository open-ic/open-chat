import type { Identity } from "@dfinity/agent";
import { idlFactory, GroupService } from "./candid/idl";
import type {
    AddParticipantsResponse,
    EventsResponse,
    GroupChatEvent,
    GroupMessage,
    ChangeAdminResponse,
    SendMessageResponse,
    RemoveParticipantResponse,
    MarkReadResponse,
    MessageIndexRange,
    UpdateGroupResponse,
    ToggleReactionResponse,
} from "../../domain/chat/chat";
import { CandidService } from "../candidService";
import {
    addParticipantsResponse,
    getEventsResponse,
    changeAdminResponse,
    sendMessageResponse,
    removeParticipantResponse,
    markReadResponse,
    updateGroupResponse,
    toggleReactionResponse,
} from "./mappers";
import type { IGroupClient } from "./group.client.interface";
import { CachingGroupClient } from "./group.caching.client";
import type { Database } from "../../utils/caching";
import { Principal } from "@dfinity/principal";
import { apiMessageContent, apiOptional } from "../common/chatMappers";
import { DataClient } from "../data/data.client";

export class GroupClient extends CandidService implements IGroupClient {
    private groupService: GroupService;

    constructor(identity: Identity, private chatId: string) {
        super(identity);
        this.groupService = this.createServiceClient<GroupService>(idlFactory, chatId);
    }

    static create(chatId: string, identity: Identity, db?: Database): IGroupClient {
        return db && process.env.CLIENT_CACHING
            ? new CachingGroupClient(db, chatId, new GroupClient(identity, chatId))
            : new GroupClient(identity, chatId);
    }

    chatEvents(startIndex: number, ascending: boolean): Promise<EventsResponse<GroupChatEvent>> {
        return this.handleResponse(
            //todo - refactor this use the new method
            this.groupService.events({
                max_messages: 20,
                max_events: 50,
                ascending: ascending,
                start_index: startIndex,
            }),
            getEventsResponse
        );
    }

    addParticipants(userIds: string[]): Promise<AddParticipantsResponse> {
        return this.handleResponse(
            this.groupService.add_participants({
                user_ids: userIds.map((u) => Principal.fromText(u)),
            }),
            addParticipantsResponse
        );
    }

    makeAdmin(userId: string): Promise<ChangeAdminResponse> {
        return this.handleResponse(
            this.groupService.make_admin({
                user_id: Principal.fromText(userId),
            }),
            changeAdminResponse
        );
    }

    dismissAsAdmin(userId: string): Promise<ChangeAdminResponse> {
        return this.handleResponse(
            this.groupService.remove_admin({
                user_id: Principal.fromText(userId),
            }),
            changeAdminResponse
        );
    }

    removeParticipant(userId: string): Promise<RemoveParticipantResponse> {
        return this.handleResponse(
            this.groupService.remove_participant({
                user_id: Principal.fromText(userId),
            }),
            removeParticipantResponse
        );
    }

    sendMessage(senderName: string, message: GroupMessage): Promise<SendMessageResponse> {
        return DataClient.create(this.identity, this.chatId)
            .uploadData(message.content)
            .then(() => {
                return this.handleResponse(
                    this.groupService.send_message({
                        content: apiMessageContent(message.content),
                        message_id: message.messageId,
                        sender_name: senderName,
                        replies_to: apiOptional(
                            (replyContext) => ({ message_id: replyContext.messageId }),
                            message.repliesTo
                        ),
                    }),
                    sendMessageResponse
                );
            });
    }

    markMessagesRead(ranges: MessageIndexRange[]): Promise<MarkReadResponse> {
        return this.handleResponse(
            this.groupService.mark_read({
                message_ranges: ranges,
            }),
            markReadResponse
        );
    }

    updateGroup(name: string, desc: string, avatar?: Uint8Array): Promise<UpdateGroupResponse> {
        return this.handleResponse(
            this.groupService.update_group({
                name: name,
                description: desc,
                avatar: apiOptional(
                    (data) => ({
                        id: DataClient.newBlobId(),
                        mime_type: "image/jpg",
                        data: Array.from(data),
                    }),
                    avatar
                ),
            }),
            updateGroupResponse
        );
    }

    toggleReaction(messageId: bigint, reaction: string): Promise<ToggleReactionResponse> {
        return this.handleResponse(
            this.groupService.toggle_reaction({
                message_id: messageId,
                reaction,
            }),
            toggleReactionResponse
        );
    }
}
