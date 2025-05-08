import { Types } from "mongoose";
import { IVideoCall } from "../../entities/videoCall.entity";

export default interface IVideoCallServices {
  initiateCall(
    conversationId: Types.ObjectId,
    callerId: Types.ObjectId,
    receiverId: Types.ObjectId,
    callerModel: string,
    receiverModel: string,
    callId: string,
    roomId: string
  ): Promise<IVideoCall>;
  updateCallStatus(
    callId: string,
    status: string,
    endedAt?: Date,
    duration?: number
  ): Promise<IVideoCall>;
  getCallHistory(conversationId: string): Promise<IVideoCall[]>;
}
