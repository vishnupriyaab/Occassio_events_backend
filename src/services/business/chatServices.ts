import mongoose, { Types } from "mongoose";
import { HttpStatusCode } from "../../constant/httpStatusCodes";
import {
  IChatMessage,
  IChatMessageModel,
  IConversation,
} from "../../interfaces/entities/chat.entity";
import IChatRepository from "../../interfaces/repository/chat.repository";
import IChatService from "../../interfaces/services/chat.services";
import { AppError } from "../../middleware/errorHandling";
import { chatRepository } from "../../repositories/entities/chatRepository";

export class ChatService implements IChatService {
  private _chatRepository: IChatRepository;

  constructor(chatRepository: IChatRepository) {
    this._chatRepository = chatRepository;
  }

  // async sendMessage(conversationId: string, message: string): Promise<IConversation | null> {
  //   try {
  //     const chatMessage: IChatMessage = {
  //       user: "user",
  //       message: message
  //     };
  //     console.log(chatMessage,conversationId, "0000000");

  //     return await this._chatRepository.addMessageToConversation(conversationId, chatMessage);
  //   } catch (error) {
  //     throw error;
  //   }

  private toObjectId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }

  // async sendMessage(
  //   conversationId: string,
  //   message: string,
  //   senderId: string,
  //   senderType: string
  // ): Promise<IConversation | null> {
  //   try {
  //     const chatMessage: IChatMessageModel = {
  //       user: senderType.toLowerCase(), // "user" or "employee"
  //       senderId: this.toObjectId(senderId),
  //       conversationid: new mongoose.Types.ObjectId(conversationId),
  //       senderModel: senderType === "user" ? "User" : "Employee",
  //       message: message,
  //     };

  //     return null;
  //     // return await this._chatRepository.addMessageToConversation(
  //     //   conversationId,
  //     //   chatMessage
  //     // );
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async userSendMessage(
    conversationId: string,
    userId: string,
    message: string
  ): Promise<IChatMessageModel> {
    try {
      
    } catch (error) {
      
    }
    return this._chatRepository.sendMessage(conversationId, userId, message, "user");
  }

  // async employeeSendMessage(conversationId: string, message: string): Promise<IConversation | null> {
  //   try {
  //     const chatMessage:IChatMessage = {
  //         user: "employee",
  //         message: message
  //     }
  //     console.log(chatMessage, conversationId,"2222222222");
  //     return await this._chatRepository.addMessageToConversation(conversationId, chatMessage);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async employeeSendMessage(
  //   conversationId: string,
  //   employeeId: string,
  //   message: string
  // ): Promise<IConversation | null> {
  //   return this.sendMessage(conversationId, message, employeeId, "employee");
  // }

  // Get all chats for an employee
  async getEmployeeChats(employeeId: string): Promise<IConversation[]> {
    try {
      return await this._chatRepository.getEmployeeChats(employeeId);
    } catch (error) {
      throw error;
    }
  }

  async getUserDetails(userId: string): Promise<any> {
    try {
      return await this._chatRepository.getUserById(userId);
    } catch (error) {
      throw error;
    }
  }

  async getChats(userId: string): Promise<IConversation> {
    try {
      return await this._chatRepository.getChat(userId);
    } catch (error) {
      throw error;
    }
  }

  async chatMessage(conversationId: Types.ObjectId): Promise<IChatMessageModel[]> {
    try {
      return await this._chatRepository.ChatMessage(conversationId);
    } catch (error) {
      throw error;
    }
  }

  async getConversationId(userId: string): Promise<IConversation> {
    try {
      console.log(userId, "userId111111");
      const conversation = await this._chatRepository.getConversationId(userId);

      console.log(conversation, "hry i'm there");

      if (!conversation) {
        throw new AppError(
          "Conversation not found",
          HttpStatusCode.NOT_FOUND,
          "ConversationNotFound"
        );
      }

      return conversation;
    } catch (error) {
      throw error;
    }
  }

  async getConversationData(): Promise<IConversation[]> {
    try {
      console.log("wertyui");
      return await this._chatRepository.getConversationData();
    } catch (error) {
      throw error;
    }
  }
}

export const chatServices = new ChatService(chatRepository);
