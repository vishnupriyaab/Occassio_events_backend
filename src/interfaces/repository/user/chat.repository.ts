import { Types } from "mongoose";
import { IChatMessage, IChatMessageModel, IConverationModel, IConversation } from "../../entities/chat.entity";

export default interface IUserChatRepository{
getChat(userId: string): Promise<IConversation>
getConversationId(userId: string): Promise<IConversation | null>
ChatMessage(conversationId: Types.ObjectId): Promise<IChatMessage[]>
getConversationData(): Promise<IConversation[]>
sendMessage(
    conversationId: string,
    userId: string,
    message: string,
    user: string
  ): Promise<IChatMessageModel>
  createRoom(data: IConverationModel): Promise<IConverationModel | null>
  getMessageById(messageId: string): Promise<IChatMessageModel | null>
  markMessageDeletedForUser(messageId: string, userId: string): Promise<any>
  markMessageDeletedForEveryone(messageId: string): Promise<any>
}