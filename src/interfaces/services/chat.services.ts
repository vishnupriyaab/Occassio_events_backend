import { IConversation } from "../entities/chat.entity";

export default interface IChatService {
  sendMessage(
    conversationId: string,
    message: string,
    senderId: string,
    senderType: string
  ): Promise<IConversation | null>;
  userSendMessage(
    conversationId: string,
    userId: string,
    message: string
  ): Promise<IConversation | null>;
  employeeSendMessage(
    conversationId: string,
    employeeId: string,
    message: string
  ): Promise<IConversation | null>;
  getEmployeeChats(employeeId: string): Promise<IConversation[]>;
  getUserDetails(userId: string): Promise<any>;
  getChats(userId: string): Promise<IConversation>;
  getConversationId(userId: string): Promise<IConversation>;
  getConversationData(): Promise<IConversation[]>;
  // sendMessage(conversationId: string, message: string): Promise<IConversation | null>;
  // employeeSendMessage(conversationId: string, message: string): Promise<IConversation | null>;
}
