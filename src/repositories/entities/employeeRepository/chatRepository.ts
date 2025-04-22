import mongoose, { Document, Types } from "mongoose";
import { IEmployee } from "../../../interfaces/entities/employee.entity";
import IEmplChatRepository from "../../../interfaces/repository/employee/chat.repository";
import Employee from "../../../models/employeeModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import {
  IChatMessage,
  IChatMessageModel,
  IConverationModel,
  IConversation,
} from "../../../interfaces/entities/chat.entity";
import Conversation, { ChatMessage } from "../../../models/chatModel";

export class EmplChatRepository
  extends CommonBaseRepository<{
    employee: Document & IEmployee;
    conversation: Document & IConversation;
    chatmessage: Document & IChatMessage;
  }>
  implements IEmplChatRepository
{
  constructor() {
    super({
      employee: Employee,
      conversation: Conversation,
      chatmessage: ChatMessage,
    });
  }

  async getChat(conversationId: string): Promise<IConverationModel> {
    try {
      let conversation: IConverationModel = (await this.findOne(
        "conversation",
        { conversationid: conversationId }
      ))!;

      return conversation;
    } catch (error) {
      throw error;
    }
  }

  async getConversationId(
    conversationId: string
  ): Promise<IConversation | null> {
    try {
      console.log(conversationId, "conversationId");
      return this.findOne("conversation", { conversationid: conversationId });
    } catch (error) {
      throw error;
    }
  }

  async ChatMessage(conversationId: Types.ObjectId): Promise<IChatMessage[]> {
    try {
      return await this.findMany("chatmessage", {
        conversationid: conversationId,
      });
    } catch (error) {
      throw error;
    }
  }

  async getConversationData(employeeId: string): Promise<IConversation[]> {
    try {
      return this.findMany("conversation", { employeeId: employeeId });
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(
    conversationId: string,
    userId: string,
    message: string,
    user: string
  ): Promise<IChatMessageModel> {
    try {
      console.log("qwertyui");
      const sendModel = user === "user" ? "User" : "Employee";
      const data: IChatMessageModel = {
        conversationid: new mongoose.Types.ObjectId(conversationId),
        message: message,
        messageType: 'text',
        user: user,
        senderId: new mongoose.Types.ObjectId(userId),
        senderModel: sendModel,
        timestamp: new Date(Date.now()),
        isDeleted: false, //rough
        deletedFor: [new mongoose.Types.ObjectId(userId)], //rough
      };
      console.log(data);
      await this.createData("chatmessage", data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getMessageById(messageId: string): Promise<IChatMessageModel | null> {
    try {
      return await this.findById("chatmessage", messageId);
    } catch (error) {
      throw error;
    }
  }

  async markMessageDeletedForEveryone(messageId: string): Promise<any> {
    try {
      return await this.findByIdAndUpdate("chatmessage", messageId, {
        isDeleted: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async saveImageMessage(conversationId: string, employeeId: string, imageUrl:string, user: string):Promise<IChatMessageModel>{
    try {
      console.log(conversationId, employeeId, imageUrl, user,"1234567890asdfghjkl\qwertyuigvhj")

      const sendModel = user === "user" ? "User" : "Employee";
      const data: IChatMessageModel = {
        conversationid: new mongoose.Types.ObjectId(conversationId),
        message: imageUrl,
        messageType: 'image',
        user: user,
        senderId: new mongoose.Types.ObjectId(employeeId),
        senderModel: sendModel,
        timestamp: new Date(Date.now()),
        isDeleted: false, 
        deletedFor: [new mongoose.Types.ObjectId(employeeId)], 
      };
      console.log(data);
      await this.createData("chatmessage", data);
      return data;

    } catch (error) {
      throw error;
    }
  }

}

export const emplChatRepository = new EmplChatRepository();
