import { Response } from "express";
import ISubClientController from "../../../interfaces/controller/user/subscription.client.controller";
import ISubClientService from "../../../interfaces/services/user/subscription.client.services";
import { subClientService } from "../../../services/business/userServices/subscriptionClientServices";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import { AppError } from "../../../middleware/errorHandling";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";

export class SubClientController implements ISubClientController {
  private _subClientService: ISubClientService;
  constructor(subClientService: ISubClientService) {
    this._subClientService = subClientService;
  }
  async fetchSubClientData(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const clientId = req.id;
      console.log(clientId, "clientId");
      if (!clientId) {
        throw new AppError(
          "Client ID is required",
          HttpStatusCode.BAD_REQUEST,
          "ClientIDIsRequired"
        );
      }
      const clientData = await this._subClientService.fetchClientData(clientId);
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Clients fetched successfully",
        clientData
      );
    } catch (error: unknown) {
      console.log(error,'error');
      if (error instanceof Error) {
        if (error.name === "ClientIDIsRequired") {
          return ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Client ID is required"
          );
        }
        if (error.name === "UserNotFound") {
          return ErrorResponse(res, HttpStatusCode.NOT_FOUND, "User not found");
        }
        if (error.name === "ClientDataNotFound") {
          return ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "Client data not found"
          );
        }
      }
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Entry registration failed. Please try again."
      );
    }
  }
}

export const subClientController = new SubClientController(subClientService);
