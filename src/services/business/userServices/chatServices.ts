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

  async userSendMessage(
    conversationId: string,
    userId: string,
    message: string
  ): Promise<IChatMessageModel> {
    return this._chatRepository.sendMessage(
      conversationId,
      userId,
      message,
      "user"
    );
  }

  async deleteMessage(
    messageId: string,
    userId: string,
    // deleteType: "me" | "everyone"
  ): Promise<any> {
    try {
      const message = await this._chatRepository.getMessageById(messageId);

      if (!message) {
        throw new AppError(
          "Message not found",
          HttpStatusCode.NOT_FOUND,
          "MessageNotFound"
        );
      }

      // if (deleteType === "everyone") {
        if (message.senderId!.toString() !== userId) {
          throw new AppError(
            "Only the sender can delete messages for everyone",
            HttpStatusCode.FORBIDDEN,
            "UnauthorizedDeletion"
          );
        }

        return await this._chatRepository.markMessageDeletedForEveryone(
          messageId
        );
      // } else {
      //   return await this._chatRepository.markMessageDeletedForUser(
      //     messageId,
      //     userId
      //   );
      // }
    } catch (error) {
      throw error;
    }
  }
}

export const userChatService = new UserChatServices(userChatRepository);
