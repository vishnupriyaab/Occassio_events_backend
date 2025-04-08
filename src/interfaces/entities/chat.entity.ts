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

export interface IChatMessage {
    user: string;
    senderId?: Types.ObjectId;
    senderModel?: string;
    message: string;
    timestamp?: Date;
  }

  export interface IConversation extends Document {
    conversationid: string;
    userId: Types.ObjectId;
    employeeId: Types.ObjectId;
    messages: IChatMessage[];
    lastUpdated?: Date;
  }
