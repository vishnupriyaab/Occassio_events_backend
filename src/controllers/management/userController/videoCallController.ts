import { Request, Response } from "express";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import IVideoCallController from "../../../interfaces/controller/user/videoCall.controller";
import IVideoCallUserServices from "../../../interfaces/services/user/videoCall.services";
import { userVideoCallService } from "../../../services/business/userServices/videoCallServices";

export class VideoCallController implements IVideoCallController {
  private _videoCallService: IVideoCallUserServices;
  constructor(videoCallService: IVideoCallUserServices) {
    this._videoCallService = videoCallService;
  }
  async initiateCall(req: Request, res: Response): Promise<void> {
    try {
      const {
        conversationId,
        callerId,
        receiverId,
        callerModel,
        receiverModel,
        callId,
        roomId,
      } = req.body;
      console.log(
        conversationId,
        callerId,
        receiverId,
        callerModel,
        receiverModel,
        callId,
        roomId,
        "sdfghjk"
      );
      const callData = await this._videoCallService.initiateCall(
        conversationId,
        callerId,
        receiverId,
        callerModel,
        receiverModel,
        callId,
        roomId
      );
      console.log(callData, "in my controllererer");
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Successfully initaite the call",
        callData
      );
    } catch (error: unknown) {
      console.log(error);
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }

  async updateCallStatus(req: Request, res: Response): Promise<void> {
    try {
      const callId = req.params.callId;
      const { status, endedAt, duration } = req.body;

      console.log(req.body, "Call status update body");
      console.log(callId, "Call ID to update");

      const updatedCall = await this._videoCallService.updateCallStatus(
        callId,
        status,
        endedAt,
        duration
      );

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Successfully updated call status",
        updatedCall
      );
    } catch (error: unknown) {
      console.log(error);
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }

  async getCallHistory(req: Request, res: Response): Promise<void> {
    try {
      const conversationId = req.params.conversationId;
      console.log("Getting call history for conversation:", conversationId);

      const callHistory = await this._videoCallService.getCallHistory(
        conversationId
      );

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Call history retrieved successfully",
        callHistory
      );
    } catch (error: unknown) {
      console.log(error);
      return ErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, "Internal server error")
    }
  }
}
export const userVideoCallController = new VideoCallController(
  userVideoCallService
);
