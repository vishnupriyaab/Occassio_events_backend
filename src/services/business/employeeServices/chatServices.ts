import { Types } from "mongoose";
import {
  IChatMessageModel,
  IConverationModel,
  IConversation,
} from "../../../interfaces/entities/chat.entity";
import IEmplChatRepository from "../../../interfaces/repository/employee/chat.repository";
import IEmplChatServices from "../../../interfaces/services/employee/chat.services";
import {
  emplChatRepository,
} from "../../../repositories/entities/employeeRepository/chatRepository";
import { AppError } from "../../../middleware/errorHandling";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";

export class EmplChatServices implements IEmplChatServices {
  private _emplChatRepo: IEmplChatRepository;
  constructor(emplChatRepo: IEmplChatRepository) {
    this._emplChatRepo = emplChatRepo;
  }

  async getChats(conversationId: string): Promise<IConverationModel> {
    try {
      return await this._emplChatRepo.getChat(conversationId);
    } catch (error) {
      throw error;
    }
  }

  async getConversationId(conversationId: string): Promise<IConversation> {
    try {
      console.log(conversationId, "conversationId");
      const conversation = await this._emplChatRepo.getConversationId(
        conversationId
      );

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
      return await this._emplChatRepo.ChatMessage(conversationId);
    } catch (error) {
      throw error;
    }
  }

  async getConversationData(employeeId: string): Promise<IConversation[]> {
    try {
      console.log("wertyui");
      return await this._emplChatRepo.getConversationData(employeeId);
    } catch (error) {
      throw error;
    }
  }

  async employeeSendMessage(
    conversationId: string,
    employeeId: string,
    message: string
  ): Promise<IChatMessageModel> {
    try {
      return this._emplChatRepo.sendMessage(
        conversationId,
        employeeId,
        message,
        "employee"
      );
    } catch (error) {
      throw error;
    }
  }

    async deleteMessage(
      messageId: string,
      userId: string,
    ): Promise<any> {
      try {
        const message = await this._emplChatRepo.getMessageById(messageId);
  
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
  
          return await this._emplChatRepo.markMessageDeletedForEveryone(
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

export const emplChatService = new EmplChatServices(emplChatRepository);
