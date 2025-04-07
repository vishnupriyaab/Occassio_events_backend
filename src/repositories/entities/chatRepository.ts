import { Document } from "mongoose";
import CommonBaseRepository from "../baseRepository/commonBaseRepository";
import { IChatMessage, IConversation } from "../../interfaces/entities/chat.entity";
import IChatRepository from "../../interfaces/repository/chat.repository";
import Conversation from "../../models/chatModel";
import { v4 as uuidv4 } from 'uuid';
import User from "../../models/userModel";
import { IUser } from "../../interfaces/entities/user.entity";

export class ChatRepository 
  extends CommonBaseRepository<{ conversation: Document & IConversation, user: Document & IUser }>
  implements IChatRepository 
{
  constructor() {
    super({ conversation: Conversation, user: User });
  }

  async getConversationByParticipants(userId: string): Promise<IConversation | null> {
    try {
      return this.findOne("conversation", { participants: userId });
    } catch (error) {
      throw error;
    }
  }

  async addMessageToConversation(conversationId: string, message: IChatMessage): Promise<IConversation | null> {
    try {
      return Conversation.findOneAndUpdate(
        { conversationid: conversationId },
        { $push: { messages: message } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId: string): Promise<any> {
    try {
      return this.findById("user", userId);
    } catch (error) {
      throw error;
    }
  }

  async getChat(userId: string): Promise<IConversation> {
    try {
      let conversation = await this.findOne("conversation", { participants: userId });

      if (!conversation) {
        const newConversation = {
          conversationid: uuidv4(),
          participants: [userId],
          messages: []
        };
        console.log(newConversation,"1234567890")

        conversation = await this.createData("conversation", newConversation);
      }
      
      return conversation;
    } catch (error) {
      throw error;
    }
  }

  async getConversationId(userId: string): Promise<IConversation | null> {
    try {
      return this.findOne("conversation", { participants: userId });
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
}

export const chatRepository = new ChatRepository();