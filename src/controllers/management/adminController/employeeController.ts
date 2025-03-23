import { Request, Response } from "express";
import IEmployeeController from "../../../interfaces/controller/admin/employee.controller";
import IEmployeeService from "../../../interfaces/services/admin/employee.services";
import { adminEmplServices } from "../../../services/business/adminServices/employeeServices";

export class EmployeeController implements IEmployeeController {
  private _emplService: IEmployeeService;

  constructor(emplService: IEmployeeService) {
    this._emplService = emplService;
  }
  async addEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone } = req.body;
      console.log(name, email, phone, "1111111111111111");
      if (!name || !email || !phone) {
        res.status(400).json({
          success: false,
          message: "Missing required fields",
          statusCode: 400,
          data: null,
        });
        return;
      }

      // Validate email format
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

}

export const adminEmplController = new EmployeeController(adminEmplServices);
