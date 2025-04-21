import { Document, Types } from "mongoose";

export interface IChatMessage extends IChatMessageModel, Document {

}
export interface IChatMessageModel {
  user: string;
  conversationid: Types.ObjectId;
  senderId?: Types.ObjectId;
  senderModel?: string;
  message: string;
  timestamp?: Date;
  isDeleted: boolean;
  deletedFor: Types.ObjectId[]
}

export interface IConversation extends IConverationModel, Document {
}

export interface IConverationModel {
  conversationid: Types.ObjectId;
  userId: Types.ObjectId;
  employeeId: Types.ObjectId;
  lastUpdated?: Date;
} 
