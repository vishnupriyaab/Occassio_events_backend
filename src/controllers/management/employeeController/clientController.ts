import { Response } from "express";
import IClientController from "../../../interfaces/controller/employee/client.controller";
import IClientService from "../../../interfaces/services/employee/client.services";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import { emplClientService } from "../../../services/business/employeeServices/clientServices";
import { AppError } from "../../../middleware/errorHandling";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";

export class ClientController implements IClientController {
  private _clientService: IClientService;
  constructor(clientService: IClientService) {
    this._clientService = clientService;
  }
  async fetchClients(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const employeeId = req.id;
      console.log(employeeId, "employeeId");
      if (!employeeId) {
        throw new AppError(
          "Employee ID is required",
          HttpStatusCode.BAD_REQUEST,
          "EmployeeIDIsRequired"
        );
      }

      const clientsData = await this._clientService.fetchClients(employeeId);

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Clients fetched successfully",
        clientsData
      );
    } catch (error: unknown) {
      console.error("Error in fetchClients controller:", error);
      if (error instanceof Error) {
        if (error.name === "EmployeeIDIsRequired") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Employee ID is required"
          );
          return;
        }
        if (error.name === "EmployeeNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Employee not found");
          return;
        }
        if (error.name === "UserIdNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "UserId not found");
          return;
        }
      }
      ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
      return;
    }
  }
}

export const emplClientController = new ClientController(emplClientService);
