import { Request, Response } from "express";
import IEmployeeController from "../../../interfaces/controller/admin/employee.controller";
import IEmployeeService from "../../../interfaces/services/admin/employee.services";
import { adminEmplServices } from "../../../services/business/adminServices/employeeServices";
import { ErrorResponse, successResponse } from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";

export class EmployeeController implements IEmployeeController {
  private _emplService: IEmployeeService;

  constructor(emplService: IEmployeeService) {
    this._emplService = emplService;
  }

  async getEmployee(req:Request,res:Response):Promise<void>{
    try {
      const searchTerm = (req.query.searchTerm as string | undefined) || "";
      const filterStatus = req.query.filterStatus as string | undefined;
      
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
      console.log(searchTerm,filterStatus,page, limit, "qwertyuio");

      const result = await this._emplService.fetchEmployee(
        searchTerm,
        filterStatus,
        page,
        limit
      );
        return successResponse(
        res,
        HttpStatusCode.OK,
        "Users fetched successfully",
        result
      );
      
    } catch (error) {
      console.log(error, "errorrrrrr");
      if (error instanceof Error) {
        if (error.name === "InvalidPageOrLimit") {
          ErrorResponse(res, 401, "InvalidPageOrLimit");
          return ;
        }
      }
      ErrorResponse(res, 500, 'Internal Server Error')
      return;
    }
  }

  async addEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone } = req.body;
      if (!name || !email || !phone) {
        res.status(400).json({
          success: false,
          message: "Missing required fields",
          statusCode: 400,
          data: null,
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: "Invalid email format",
          statusCode: 400,
          data: null,
        });
        return;
      }

      const employeeData = { name, email, phone };
      const result = await this._emplService.addEmployee(employeeData);

      if (result) {
        res.status(201).json({
          success: true,
          message:
            "Employee added successfully. Onboarding email has been sent.",
          statusCode: 201,
          data: result,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to add employee",
          statusCode: 500,
          data: null,
        });
      }
    } catch (error) {
      console.log(error, "errorrrrrr");
      res.status(500).json({
        success: false,
        message: "An error occurred while adding employee",
        statusCode: 500,
        data: null,
      });
    }
  }

  async blockEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = req.params.id;
      console.log(employeeId, "employeeId");
      const result = await this._emplService.blockEmployee(employeeId);

      const response = result?.isBlocked
        ? "Employee blocked successfully"
        : "Employee unblocked successfully";

      return successResponse(res, HttpStatusCode.OK, response, result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "EmployeeNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Employee not found");
          return;
        }
      }
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }

  //deleteEmployee
  async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = req.params.id;
      await this._emplService.deleteEmployee(employeeId);

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Employee successfully deleted"
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "EmployeeNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Employee not found");
          return;
        }
      }
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }

}

export const adminEmplController = new EmployeeController(adminEmplServices);
