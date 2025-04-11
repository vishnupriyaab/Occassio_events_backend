import { Types } from "mongoose";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  IChatMessageModel,
  IConversation,
} from "../../../interfaces/entities/chat.entity";
import IUserChatRepository from "../../../interfaces/repository/user/chat.repository";
import IUserChatServices from "../../../interfaces/services/user/chat.services";
import { AppError } from "../../../middleware/errorHandling";
import { userChatRepository } from "../../../repositories/entities/userRepositories.ts/chatRepository";

export class UserChatServices implements IUserChatServices {
  private _chatRepository: IUserChatRepository;
  constructor(chatRepository: IUserChatRepository) {
    this._chatRepository = chatRepository;
  }

  async getChats(userId: string): Promise<IConversation> {
    try {
      return await this._chatRepository.getChat(userId);
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

  async chatMessage(
    conversationId: Types.ObjectId
  ): Promise<IChatMessageModel[]> {
    try {
      return await this._chatRepository.ChatMessage(conversationId);
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

  // async employeeSendMessage(
  //   conversationId: string,
  //   employeeId: string,
  //   message: string
  // ): Promise<IChatMessageModel> {
  //   try {
  //     return this._chatRepository.sendMessage(
  //       conversationId,
  //       employeeId,
  //       message,
  //       "employee"
  //     );
  //   } catch (error) {
  //     throw error;
  //   }
  // }

    async userSendMessage(
      conversationId: string,
      userId: string,
      message: string
    ): Promise<IChatMessageModel> {
      return this._chatRepository.sendMessage(conversationId, userId, message, "user");
    }

}

export const userChatService = new UserChatServices(userChatRepository);
