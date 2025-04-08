import { Request, Response } from "express";
import IEmployeeController from "../../../interfaces/controller/admin/employee.controller";
import IEmployeeService from "../../../interfaces/services/admin/employee.services";
import { adminEmplServices } from "../../../services/business/adminServices/employeeServices";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { AppError } from "../../../middleware/errorHandling";

export class EmployeeController implements IEmployeeController {
  private _emplService: IEmployeeService;

  constructor(emplService: IEmployeeService) {
    this._emplService = emplService;
  }

  async getEmployee(req: Request, res: Response): Promise<void> {
    try {
      const searchTerm = (req.query.searchTerm as string | undefined) || "";
      const filterStatus = req.query.filterStatus as string | undefined;

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      console.log(searchTerm, filterStatus, page, limit, "qwertyuio");

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
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Invalid Page or limit"
          );
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

  async addEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone } = req.body;
      if (!name || !email || !phone) {
        throw new AppError(
          "All fields are required",
          HttpStatusCode.BAD_REQUEST,
          "FieldsAreRequired"
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new AppError(
          "Invalid email format",
          HttpStatusCode.BAD_REQUEST,
          "InvalidEmailFormat"
        );
      }

      const employeeData = { name, email, phone };
      const result = await this._emplService.addEmployee(employeeData);

      if (result) {
        return successResponse(
          res,
          HttpStatusCode.CREATED,
          "Employee added successfully. Onboarding email has been sent.",
          result
        );
      } else {
        return ErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "Failed to add employee"
        );
      }
    } catch (error: unknown) {
      console.log(error, "errorrrrrr");
      if (error instanceof Error) {
        if (error.name === "EmployeeAlreadyExists") {
          ErrorResponse(
            res,
            HttpStatusCode.CONFLICT,
            "An employee with this email already exists"
          );
          return;
        }
      }
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "An error occurred while adding employee"
      );
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
