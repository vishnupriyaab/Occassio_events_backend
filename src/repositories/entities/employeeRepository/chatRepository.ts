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
import { IUser } from "../../../interfaces/entities/user.entity";
import User from "../../../models/userModel";
import { timeStamp } from "console";

export class EmplChatRepository
  extends CommonBaseRepository<{
    employee: Document & IEmployee;
    conversation: Document & IConversation;
    chatmessage: Document & IChatMessage;
    user: Document & IUser;
  }>
  implements IEmplChatRepository
{
  constructor() {
    super({
      employee: Employee,
      conversation: Conversation,
      chatmessage: ChatMessage,
      user: User,
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

  async getUsers(userId: Types.ObjectId[]): Promise<any> {
    try {
      const users = this.findMany("user", { _id: { $in: userId } });
      console.log(users,"usersssss");
      return users;
    } catch (error) {
      throw error;
    }
  }

  // async getConversationData(employeeId: string): Promise<IConversation[]> {
  //   try {
  //     console.log("startok")
  //     const conversations =  this.findMany("conversation", { employeeId: employeeId });
  //     const conversationsWithLastMessage = await Promise.all((await conversations).map(async (conversation) => {
  //       console.log(conversation,"conversation");
  //       const lastMessage = await this.findOne("chatmessage", 
  //         { conversationid: conversation._id }
  //       ).sort({timeStamp: -1}).limit(1)

  //       // const lastMessage = lastMessages.length > 0 ? lastMessages[0] : null;
  //       console.log(lastMessage,"121212");
        
  //       return {
  //         ...conversation.toObject(),
  //         lastMessage: lastMessage
  //       };
  //     }));
      
  //     return conversationsWithLastMessage;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  async getConversationData(employeeId: string): Promise<IConversation[]> {
    try {
      console.log("startok")
      const conversations = await this.findMany("conversation", { employeeId: employeeId });
      const conversationsWithLastMessage = await Promise.all(conversations.map(async (conversation) => {
        const messages = await this.findMany("chatmessage", 
          { conversationid: conversation.conversationid },
          { sort: { timestamp: -1 }, limit: 1 }
        );
        console.log(messages,"messages")
  
        const lastMessage = messages.length > 0 ? messages[0] : null;
        console.log(lastMessage, "last message");
        
        return {
          ...conversation.toObject(),
          lastMessage: lastMessage
        };
      }));
      
      return conversationsWithLastMessage;
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
        messageType: "text",
        user: user,
        senderId: new mongoose.Types.ObjectId(userId),
        senderModel: sendModel,
        timestamp: new Date(Date.now()),
        isDeleted: false, //rough
        deletedFor: [new mongoose.Types.ObjectId(userId)], //rough
      };
      const result = await this.createData("chatmessage", data);
      console.log(result, "=======");
      return result;
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

  async saveImageMessage(
    conversationId: string,
    employeeId: string,
    imageUrl: string,
    user: string
  ): Promise<IChatMessageModel> {
    try {
      console.log(
        conversationId,
        employeeId,
        imageUrl,
        user,
        "1234567890asdfghjklqwertyuigvhj"
      );

      const sendModel = user === "user" ? "User" : "Employee";
      const data: IChatMessageModel = {
        conversationid: new mongoose.Types.ObjectId(conversationId),
        message: imageUrl,
        messageType: "image",
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

  async addReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<IChatMessageModel> {
    try {
      const addMessageReaction = await this.findByIdAndUpdate(
        "chatmessage",
        messageId,
        {
          $push: {
            reactions: {
              userId: new mongoose.Types.ObjectId(userId),
              emoji: emoji,
            },
          },
        }
      );
      return addMessageReaction!;
    } catch (error: unknown) {
      throw error;
    }
  }

  async removeReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<IChatMessageModel> {
    try {
      const removeMessageReaction = await this.findByIdAndUpdate(
        "chatmessage",
        messageId,
        {
          $pull: {
            reactions: {
              userId: new mongoose.Types.ObjectId(userId),
              emoji: emoji,
            },
          },
        }
      );
      return removeMessageReaction!;
    } catch (error) {
      throw error;
    }
  }
}

export const emplChatRepository = new EmplChatRepository();
