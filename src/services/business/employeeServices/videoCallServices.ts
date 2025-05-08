import { Types } from "mongoose";
import IVideoCallRepository from "../../../interfaces/repository/employee/videoCall.repository";
import IVideoCallServices from "../../../interfaces/services/employee/videoCall.services";
import { videoCallRepository } from "../../../repositories/entities/employeeRepository/videoCallRepository";
import { IVideoCall } from "../../../interfaces/entities/videoCall.entity";

export class VideoCallService implements IVideoCallServices {
  private _videoCallRepo: IVideoCallRepository;
  constructor(videocallRepo: IVideoCallRepository) {
    this._videoCallRepo = videocallRepo;
  }

  async initiateCall(
    conversationId: Types.ObjectId,
    callerId: Types.ObjectId,
    receiverId: Types.ObjectId,
    callerModel: string,
    receiverModel: string,
    callId: string,
    roomId: string
  ): Promise<IVideoCall> {
    try {
      const callerModell = callerModel === "User" ? "User" : "Employee";
      const receiverModell = receiverModel === "User" ? "User" : "Employee";

      const callData = {
        conversationId: conversationId,
        callerId: callerId,
        receiverId: receiverId,
        callerModel: callerModell,
        receiverModel: receiverModell,
        callId: callId,
        roomId: roomId,
        status: "initiated",
        startedAt: new Date(),
      };
      console.log(callData, "callData");
      const result = await this._videoCallRepo.saveCallData(callData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateCallStatus(
    callId: string,
    status: string,
    endedAt?: Date,
    duration?: number
  ): Promise<IVideoCall> {
    try {
      const updateData: any = { status };

      if (status === "ended" && endedAt) {
        updateData.endedAt = endedAt;
      }

      if (duration !== undefined) {
        updateData.duration = duration;
      }

      const result = await this._videoCallRepo.updateCallStatus(
        callId,
        updateData
      );
      return result!;
    } catch (error) {
      throw error;
    }
  }

  async getCallHistory(conversationId: string): Promise<IVideoCall[]> {
    try {
      const result = await this._videoCallRepo.getCallsByConversationId(
        conversationId
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

const emplVideoCallRepository = new videoCallRepository();
export const emplVideoCallService = new VideoCallService(
  emplVideoCallRepository
);
