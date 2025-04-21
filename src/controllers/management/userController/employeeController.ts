import { Request, Response } from "express";
import IEmployeeController from "../../../interfaces/controller/user/employee.controller";
import IEmployeeServices from "../../../interfaces/services/user/employee.services";
import { employeeService } from "../../../services/business/userServices/employeeServices";
import { ErrorResponse, successResponse } from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";

export class EmployeeController implements IEmployeeController {
  private _employeeService: IEmployeeServices;
  constructor(employeeService: IEmployeeServices) {
    this._employeeService = employeeService;
  }
  async fetchEmployeeDetails(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = req.params.employeeId;
      console.log(employeeId, 1234567890);
      const employeeDetails = await this._employeeService.getEmployeeDetails(
        employeeId
      );
      console.log(employeeDetails, "employeeDetailssss");
      return successResponse(res, HttpStatusCode.OK, "Employee details fetched successfully", employeeDetails);
    } catch (error: unknown) {
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Fetch EmployeeDetails is Failed"
      );
    }
  }
}

export const employeeController = new EmployeeController(employeeService);
