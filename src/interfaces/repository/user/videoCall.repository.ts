import { callData, IVideoCall } from "../../entities/videoCall.entity";

export default interface IVideoCallUserRepository {
  saveCallData(callData: callData): Promise<IVideoCall>;
  updateCallStatus(callId: string, updateData: Partial<IVideoCall>): Promise<IVideoCall>
  getCallsByConversationId(conversationId: string): Promise<IVideoCall[]>
}
