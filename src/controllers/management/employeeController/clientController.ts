import { Response } from "express";
import IClientController from "../../../interfaces/controller/employee/client.controller";
import IClientService from "../../../interfaces/services/employee/client.services";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import { emplClientService } from "../../../services/business/employeeServices/clientServices";

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
        const error = new Error("Employee ID is required");
        error.name = "EmployeeIDIsRequired";
        throw error;
      }

      const clientsData = await this._clientService.fetchClients(employeeId);

      res.status(200).json({
        status: "success",
        message: "Clients fetched successfully",
        data: clientsData,
      });
    } catch (error: unknown) {
      console.error("Error in fetchClients controller:", error);
    }
  }
}

export const emplClientController = new ClientController(emplClientService);
