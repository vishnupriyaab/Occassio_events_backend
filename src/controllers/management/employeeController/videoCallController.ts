import { Request, Response } from "express";
import IVideoCallController from "../../../interfaces/controller/employee/videoCall.controller";
import IVideoCallServices from "../../../interfaces/services/employee/videoCall.services";
import { emplVideoCallService } from "../../../services/business/employeeServices/videoCallServices";
import { successResponse } from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";

export class VideoCallController implements IVideoCallController {
  private _videoCallService: IVideoCallServices;
  constructor(videoCallService: IVideoCallServices) {
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
      return successResponse(res, HttpStatusCode.OK, "Successfully initaite the call",callData);
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
    }
  }
}
export const emplVideoCallController = new VideoCallController(
  emplVideoCallService
);
