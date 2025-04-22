import { Types } from "mongoose";
import { IChatMessageModel, IConverationModel, IConversation } from "../../entities/chat.entity";

export default interface IEmplChatServices {
  getChats(employeeId: string): Promise<IConverationModel>;
  getConversationId(conversationId: string): Promise<IConversation>
  chatMessage(conversationId: Types.ObjectId): Promise<IChatMessageModel[]>
  getConversationData(employeeId:string): Promise<IConversation[]>
  employeeSendMessage(conversationId: string, employeeId:string, message: string): Promise<IChatMessageModel>
  deleteMessage( messageId: string, userId: string, 
    // deleteType: "me" | "everyone"
  ): Promise<any>
  saveImageMessage(base64Image: string, fileName: string, employeeId: string, conversationId: string): Promise<IChatMessageModel> 
}
