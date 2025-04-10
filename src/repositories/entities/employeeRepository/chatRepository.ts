import { Document, Types } from "mongoose";
import { IEmployee } from "../../../interfaces/entities/employee.entity";
import IEmplChatRepository from "../../../interfaces/repository/employee/chat.repository";
import Employee from "../../../models/employeeModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import { IChatMessage, IConverationModel, IConversation } from "../../../interfaces/entities/chat.entity";
import Conversation, { ChatMessage } from "../../../models/chatModel";

export class EmplChatRepository
  extends CommonBaseRepository<{ employee: Document & IEmployee; conversation: Document & IConversation; chatmessage: Document & IChatMessage }>
  implements IEmplChatRepository
{
  constructor() {
    super({ employee: Employee, conversation: Conversation, chatmessage: ChatMessage });
  }

    async getChat(conversationId: string): Promise<IConverationModel> {
      try {
        
        let conversation: IConverationModel = (await this.findOne("conversation", {conversationid: conversationId}))!;
  
        return conversation;
      } catch (error) {
        throw error;
      }
    }

      async getConversationId(conversationId: string): Promise<IConversation | null> {
        try {
          console.log(conversationId, "conversationId");
          return this.findOne("conversation", { conversationid: conversationId }); 
        } catch (error) {
          throw error;
        }
      }

        async ChatMessage(conversationId: Types.ObjectId): Promise<IChatMessage[]> {
          try {
            return await this.findMany("chatmessage",{conversationid : conversationId})
          } catch (error) {
            throw error;
          }
        }

          async getConversationData(employeeId:string): Promise<IConversation[]> {
            try {
              return this.findMany("conversation", {employeeId: employeeId });
            } catch (error) {
              throw error;
            }
          }

}

export const emplChatRepository = new EmplChatRepository();
