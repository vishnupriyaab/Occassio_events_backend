import { Types } from "mongoose";
import { IChatMessage, IChatMessageModel, IConverationModel, IConversation } from "../../entities/chat.entity";

export default interface IEmplChatRepository {
  getUsers(userId: Types.ObjectId[]): Promise<any>
  getChat(userId: string): Promise<IConverationModel>;
  getConversationId(userId: string): Promise<IConversation | null>;
  ChatMessage(conversationId: Types.ObjectId): Promise<IChatMessage[]>;
  getConversationData(employeeId:string): Promise<IConversation[]>
  sendMessage(conversationId: string, userId:string, message:string, user:string):Promise<IChatMessageModel>
  getMessageById(messageId: string): Promise<IChatMessageModel | null>
  markMessageDeletedForEveryone(messageId: string): Promise<any>
  saveImageMessage(conversationId: string, employeeId: string, imageUrl:string, user: string):Promise<IChatMessageModel>
  addReaction(messageId: string, userId: string, emoji: string): Promise<IChatMessageModel>
  removeReaction(messageId: string, userId: string, emoji: string): Promise<IChatMessageModel>
}
