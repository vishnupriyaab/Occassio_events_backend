import { Document, Types } from "mongoose";

export interface IChatMessage extends IChatMessageModel, Document {

}

export interface IReaction {
  userId: Types.ObjectId;
  emoji: string;
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
  messageType: "text" | "image";
  reactions?: IReaction[];
  // actionType?: "add" | "remove"
}

export interface IConversation extends IConverationModel, Document {
  userName:string;
}

export interface IConverationModel {
  conversationid: Types.ObjectId;
  userId: Types.ObjectId;
  employeeId: Types.ObjectId;
  lastUpdated?: Date;
} 
