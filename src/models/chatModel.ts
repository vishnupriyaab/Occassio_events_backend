import mongoose, { Document, Schema } from "mongoose";
import {
  IChatMessage,
  IConversation,
} from "../interfaces/entities/chat.entity";

const chatMessageSchema: Schema = new Schema<IChatMessage>({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema: Schema = new Schema<IConversation>({
  conversationid: {
    type: String,
    required: true,
    unique: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [chatMessageSchema],
});

const Conversation = mongoose.model<IConversation & Document>("Chat", conversationSchema)
export default Conversation;