import { Document } from "mongoose";
import { IVideoCall } from "../../../interfaces/entities/videoCall.entity";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import { VideoCall } from "../../../models/videoCallModel";
import IVideoCallUserRepository from "../../../interfaces/repository/user/videoCall.repository";

export class videoCallUserRepository
  extends CommonBaseRepository<{ videoCall: IVideoCall & Document }>
  implements IVideoCallUserRepository
{
  constructor() {
    super({ videoCall: VideoCall });
  }

  async saveCallData(callData: IVideoCall): Promise<IVideoCall> {
    try {
      const result = await this.createData("videoCall", callData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateCallStatus(callId: string, updateData: Partial<IVideoCall>): Promise<IVideoCall> {
    try {
      const result = await this.findOneAndUpdate(
        "videoCall",
        { callId: callId },
        updateData
      );
      return result!;
    } catch (error) {
      throw error;
    }
  }
  
  async getCallsByConversationId(conversationId: string): Promise<IVideoCall[]> {
    try {
      const result = await this.findMany(
        "videoCall",
        { conversationId: conversationId },
        { sort: { startedAt: -1 } } 
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

}
