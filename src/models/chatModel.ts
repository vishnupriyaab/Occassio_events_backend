import mongoose, { Document, Schema } from "mongoose";
import {
  IChatMessage,
  IConversation,
} from "../interfaces/entities/chat.entity";

const chatMessageSchema = new Schema<IChatMessage>({
  user: {
    type: String,
    enum: ["user", "employee"],
    required: true,
  },
  conversationid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "senderModel",
    required: true,
  },
  senderModel: {
    type: String,
    enum: ["User", "Employee"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    enum: ["text", "image"],
    default: "text"
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
});
export const ChatMessage = mongoose.model<IChatMessage & Document>(
  "chatmessage",
  chatMessageSchema
);

const conversationSchema = new Schema<IConversation>(
  {
    conversationid: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation & Document>(
  "Conversation",
  conversationSchema
);
export default Conversation;
