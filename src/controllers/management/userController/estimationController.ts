import { Response } from "express";
import IUserEstimationController from "../../../interfaces/controller/user/estimation.controller";
import IUserEstimationService from "../../../interfaces/services/user/estimation.services";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import { userEstiService } from "../../../services/business/userServices/estimationServices";
import { successResponse } from "../../../integration/responseHandler";
import { HttpStatusCode } from "axios";

export class UserEsimationController implements IUserEstimationController {
  private _userEstiService: IUserEstimationService;
  constructor(userEstiService: IUserEstimationService) {
    this._userEstiService = userEstiService;
  }

  async fetchEstimation(req:AuthenticatedRequest, res:Response):Promise<void>{
    try {
        const userId: string = req.id || "";
        console.log(userId);
        const fetchEstimation = await this._userEstiService.fetchEstimation(userId);
        console.log(fetchEstimation,"fetchEstimation");
        return successResponse(res, HttpStatusCode.Ok, 'Successfully fetched the estimation', fetchEstimation)
    } catch (error) {
        throw error;
    }
  }

}

export const userEstiController = new UserEsimationController(userEstiService);