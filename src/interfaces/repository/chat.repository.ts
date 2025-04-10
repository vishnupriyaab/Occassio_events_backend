import { Types } from "mongoose";
import { IChatMessage, IChatMessageModel, IConverationModel, IConversation } from "../entities/chat.entity";

export default interface IChatRepository {
    getConversationByParticipants(userId: string): Promise<IConversation | null>;
    addMessageToConversation(conversationId: string, message: IChatMessage): Promise<IConversation | null>;
    getUserById(userId: string): Promise<any>;
    getChat(userId: string): Promise<IConversation>;
    getConversationId(userId: string): Promise<IConversation | null>;
    getConversationData(): Promise<IConversation[]>;
    getEmployeeChats(employeeId: string): Promise<IConversation[]>
    createRoom(
        data: IConverationModel
      ): Promise<IConverationModel | null>
      ChatMessage(conversationId: Types.ObjectId): Promise<IChatMessage[]>
      sendMessage(conversationId: string, userId:string, message:string, user:string):Promise<IChatMessageModel>
  }