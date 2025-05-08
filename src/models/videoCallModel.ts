import mongoose, { Schema } from "mongoose";
import { IVideoCall } from "../interfaces/entities/videoCall.entity";

const videoCallSchema = new Schema<IVideoCall>(
    {
      conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true, 
      },
      callerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "callerModel",
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "receiverModel", 
      },
      callerModel: {
        type: String,
        enum: ["User", "Employee"],
        required: true,
      },
      receiverModel: {
        type: String,
        enum: ["User", "Employee"],
        required: true,
      },
      callId: {
        type: String,
        required: true,
      },
      roomId: {
        type: String,
      },
      status: {
        type: String,
        // enum: ["initiated", "accepted", "rejected", "ended", "missed"],
        default: "initiated",
      },
      startedAt: {
        type: Date,
        default: Date.now,
      },
      endedAt: Date,
      duration: Number,
    },
    { timestamps: true }
  );
  
  export const VideoCall = mongoose.model<IVideoCall>("VideoCall", videoCallSchema);