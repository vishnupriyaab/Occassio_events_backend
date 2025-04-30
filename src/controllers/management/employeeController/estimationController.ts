import { Request, Response } from "express";
import IEmplEstimationController from "../../../interfaces/controller/employee/estimation.controller";
import IEmplEstimationServices from "../../../interfaces/services/employee/estimation.services";
import { emplEstimationService } from "../../../services/business/employeeServices/estimationServices";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import { successResponse } from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";

export class EmplEstimationController implements IEmplEstimationController {
  private _emplEstiService: IEmplEstimationServices;
  constructor(emplEstiService: IEmplEstimationServices) {
    this._emplEstiService = emplEstiService;
  }

  async saveEstimation(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { estimationData, grandTotal, userId } = req.body;
      const employeeId: string = req.id || "";
      const savedResult = await this._emplEstiService.saveEstimation(
        estimationData,
        grandTotal,
        userId,
        employeeId
      );
      console.log(savedResult, "wertyuio");
      return successResponse(
        res,
        HttpStatusCode.OK,
        "New estimation is created",
        savedResult
      );
    } catch (error) {
      throw error;
    }
  }

  async fetchEstimation(req: Request, res: Response): Promise<void> {
    try {
      const userId  = req.query.userId as string;
      const fetchedResult = await this._emplEstiService.fetchEstimation(userId);
      console.log(fetchedResult,"controller");
      return successResponse(res, HttpStatusCode.OK, "successfully fetched estimation", fetchedResult);
    } catch (error) {
      throw error;
    }
  }
}
export const emplEstimationController = new EmplEstimationController(
  emplEstimationService
);
