import mongoose, { Document, Types } from "mongoose";
import {
  IChatMessage,
  IChatMessageModel,
  IConverationModel,
  IConversation,
} from "../../../interfaces/entities/chat.entity";
import IUserChatRepository from "../../../interfaces/repository/user/chat.repository";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import Conversation, { ChatMessage } from "../../../models/chatModel";
import { IUser } from "../../../interfaces/entities/user.entity";
import User from "../../../models/userModel";

export class UserChatRepository
  extends CommonBaseRepository<{
    conversation: Document & IConversation;
    user: Document & IUser;
    chatmessage: Document & IChatMessage;
  }>
  implements IUserChatRepository
{
  constructor() {
    super({
      conversation: Conversation,
      user: User,
      chatmessage: ChatMessage,
    });
  }

  private toObjectId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }

  async getChat(userId: string): Promise<IConversation> {
    try {
      const user = await this.findById("user", userId);

      if (!user || !user.assignedEmployee) {
        throw new Error("User has no assigned employee");
      }

      let conversation = await this.findOne("conversation", {
        userId: userId,
        employeeId: user.assignedEmployee,
      });

      if (!conversation) {
        const newConversation: IConverationModel = {
          conversationid: new mongoose.Types.ObjectId(),
          userId: this.toObjectId(userId),
          employeeId: user.assignedEmployee,
        };

        conversation = await this.createData("conversation", newConversation);
      }

      return conversation;
    } catch (error) {
      throw error;
    }
  }

  async getConversationId(userId: string): Promise<IConversation | null> {
    try {
      console.log(userId, "userId22222");
      return this.findOne("conversation", { userId: userId });
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

  async getConversationData(): Promise<IConversation[]> {
    try {
      return this.findMany("conversation", {});
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
        user: user,
        senderId: new mongoose.Types.ObjectId(userId),
        senderModel: sendModel,
        timestamp: new Date(Date.now()),
      };
      console.log(data);
      await this.createData("chatmessage", data);
      return data;
    } catch (error) {
      throw error;
    }
  }

    async createRoom(data: IConverationModel): Promise<IConverationModel | null> {
    try {
      return this.createData("conversation", data);
    } catch (error) {
      throw error;
    }
  }

}

export const userChatRepository = new UserChatRepository();
