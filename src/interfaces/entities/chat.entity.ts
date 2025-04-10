// import { Document } from 'mongoose';

// export interface IChatMessage {
//   user: string;
//   senderId: string;
//   message: string;
//   timestamp?: Date;

// }

// export interface IConversation extends Document {
//   conversationid: string;
//   participants: string[];
//   messages: IChatMessage[];
// }

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
}

export interface IConversation extends IConverationModel, Document {
  // conversationid: Types.ObjectId;
  // userId: Types.ObjectId;
  // employeeId: Types.ObjectId;
  // // messages: IChatMessage[];
  // lastUpdated?: Date;
}

export interface IConverationModel {
  conversationid: Types.ObjectId;
  userId: Types.ObjectId;
  employeeId: Types.ObjectId;
  lastUpdated?: Date;
} 
