import { Types } from "mongoose";
import { IChatMessage, IChatMessageModel, IConverationModel, IConversation } from "../../entities/chat.entity";

export default interface IEmplChatRepository {
  getChat(userId: string): Promise<IConverationModel>;
  getConversationId(userId: string): Promise<IConversation | null>;
  ChatMessage(conversationId: Types.ObjectId): Promise<IChatMessage[]>;
  getConversationData(employeeId:string): Promise<IConversation[]>
  sendMessage(conversationId: string, userId:string, message:string, user:string):Promise<IChatMessageModel>
  getMessageById(messageId: string): Promise<IChatMessageModel | null>
  markMessageDeletedForEveryone(messageId: string): Promise<any>
}
