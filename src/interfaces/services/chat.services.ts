import { IConversation } from "../entities/chat.entity";

export default interface IChatService {
    sendMessage(conversationId: string, message: string): Promise<IConversation | null>;
    employeeSendMessage(conversationId: string, message: string): Promise<IConversation | null>;
    getUserDetails(userId: string): Promise<any>;
    getChats(userId: string): Promise<IConversation>;
    getConversationId(userId: string): Promise<IConversation>;
    getConversationData(): Promise<IConversation[]>;
  }