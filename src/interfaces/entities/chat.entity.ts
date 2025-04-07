import { Document } from 'mongoose';

export interface IChatMessage {
  user: string;
  message: string;
  timestamp?: Date;
}

export interface IConversation extends Document {
  conversationid: string;
  participants: string[];
  messages: IChatMessage[];
}
