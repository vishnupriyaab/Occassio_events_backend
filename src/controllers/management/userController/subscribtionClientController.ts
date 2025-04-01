import { Response } from "express";
import ISubClientController from "../../../interfaces/controller/user/subscription.client.controller";
import ISubClientService from "../../../interfaces/services/user/subscription.client.services";
import { subClientService } from "../../../services/business/userServices/subscriptionClientServices";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";

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
        const error = new Error("Client ID is required");
        error.name = "ClientIDIsRequired";
        throw error;
      }
      const clientData = await this._subClientService.fetchClientData(clientId);
      res.status(200).json({
        status: "success",
        message: "Clients fetched successfully",
        data: clientData,
      });
    } catch (error: unknown) {
      console.error("Error in fetchSubClientData:", error);
    }
  }
}

export const subClientController = new SubClientController(subClientService);
