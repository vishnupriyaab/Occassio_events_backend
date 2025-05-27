import mongoose, { Document } from "mongoose";

export interface IVideoCall extends Document {
  conversationId: mongoose.Types.ObjectId;
  callerId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  callerModel: "User" | "Employee";
  receiverModel: "User" | "Employee";
  callId: string; // ZegoCloud unique call/session ID
  roomId: string; // ZegoCloud room ID
  status: string;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
}

export interface callData {
  conversationId: mongoose.Types.ObjectId;
  callerId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  callerModel: string;
  receiverModel: string;
  callId: string; // ZegoCloud unique call/session ID
  roomId: string; // ZegoCloud room ID
  status: string;
  startedAt: Date;
}

export interface VideoCallUpdateData {
  status: string;
  endedAt?: Date;
  duration?: number;
}
