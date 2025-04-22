import { Types } from "mongoose";
import { IChatMessageModel, IConversation } from "../../entities/chat.entity";

export default interface IUserChatServices {
  getChats(userId: string): Promise<IConversation>;
  getConversationId(userId: string): Promise<IConversation>;
  chatMessage(conversationId: Types.ObjectId): Promise<IChatMessageModel[]>;
  getConversationData(): Promise<IConversation[]>;
  userSendMessage(
    conversationId: string,
    userId: string,
    message: string
  ): Promise<IChatMessageModel>;
  deleteMessage(
    messageId: string,
    userId: string
    // deleteType: 'me' | 'everyone'
  ): Promise<any>;
  saveImageMessage(
    base64Image: string,
    fileName: string,
    employeeId: string,
    conversationId: string
  ): Promise<IChatMessageModel>;
}
