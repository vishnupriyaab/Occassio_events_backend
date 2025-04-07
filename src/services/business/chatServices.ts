import { HttpStatusCode } from "../../constant/httpStatusCodes";
import { IChatMessage, IConversation } from "../../interfaces/entities/chat.entity";
import IChatRepository from "../../interfaces/repository/chat.repository";
import IChatService from "../../interfaces/services/chat.services";
import { AppError } from "../../middleware/errorHandling";
import { chatRepository } from "../../repositories/entities/chatRepository";

export class ChatService implements IChatService {
    private _chatRepository: IChatRepository;
  
    constructor(chatRepository: IChatRepository) {
      this._chatRepository = chatRepository;
    }
  
    async sendMessage(conversationId: string, message: string): Promise<IConversation | null> {
      try {
        const chatMessage: IChatMessage = {
          user: "user",
          message: message
        };
        console.log(chatMessage,conversationId, "0000000");
        
        return await this._chatRepository.addMessageToConversation(conversationId, chatMessage);
      } catch (error) {
        throw error;
      }
    }
  
    async employeeSendMessage(conversationId: string, message: string): Promise<IConversation | null> {
      try {
        const chatMessage:IChatMessage = {
            user: "employee",
            message: message
        }
        console.log(chatMessage, conversationId,"2222222222");
        return await this._chatRepository.addMessageToConversation(conversationId, chatMessage);
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
  
    async getConversationId(userId: string): Promise<IConversation> {
      try {
        const conversation = await this._chatRepository.getConversationId(userId);
        
        if (!conversation) {
          throw new AppError(
            'Conversation not found',
            HttpStatusCode.NOT_FOUND,
            'ConversationNotFound'
          );
        }
  
        return conversation;
      } catch (error) {
        throw error;
      }
    }
  
    async getConversationData(): Promise<IConversation[]> {
      try {
        return await this._chatRepository.getConversationData();
      } catch (error) {
        throw error;
      }
    }
  }
  
  export const chatServices = new ChatService(chatRepository);