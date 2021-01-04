import { ChatId } from "../../model/chats";
import { UserId } from "../../model/users";
import createGroupChat, { CreateGroupChatResponse } from "./createGroupChat";
import sendDirectMessage, { SendDirectMessageResponse } from "./sendDirectMessage";
import sendMessage, { SendMessageResponse } from "./sendMessage";
import markRead, { MarkReadResponse } from "./markRead";
import addParticipants, { AddParticipantsResponse } from "./addParticipants";
import removeParticipant, { RemoveParticipantResponse } from "./removeParticipant";
import getMessages, { getMessagesById, GetMessagesResponse } from "./getMessages";
import listChats, { ListChatsResponse } from "./listChats";

export default class service {
    public static createGroupChat(subject: string, users: UserId[]) : Promise<CreateGroupChatResponse> {
        return createGroupChat(subject, users);
    }

    public static sendDirectMessage(userId: UserId, message: string) : Promise<SendDirectMessageResponse> {
        return sendDirectMessage(userId, message);
    }

    public static sendMessage(chatId: ChatId, message: string) : Promise<SendMessageResponse> {
        return sendMessage(chatId, message);
    }

    public static markRead(chatId: ChatId, upToIndex: number) : Promise<MarkReadResponse> {
        return markRead(chatId, upToIndex);
    }

    public static addParticipants(chatId: ChatId, users: UserId[]) : Promise<AddParticipantsResponse> {
        return addParticipants(chatId, users);
    }

    public static removeParticipant(chatId: ChatId, user: UserId) : Promise<RemoveParticipantResponse> {
        return removeParticipant(chatId, user);
    }

    public static getMessages(chatId: ChatId, fromId: number, pageSize: number) : Promise<GetMessagesResponse> {
        return getMessages(chatId, fromId, pageSize);
    }

    public static getMessagesById(chatId: ChatId, ids: number[]) : Promise<GetMessagesResponse> {
        return getMessagesById(chatId, ids);
    }

    public static listChats(unreadOnly: boolean) : Promise<ListChatsResponse> {
        return listChats(unreadOnly);
    }
}

