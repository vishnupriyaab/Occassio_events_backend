import { Document } from "mongoose";
import {
  IEmployee,
  IEmplRegData,
} from "../../../interfaces/entities/employee.entity";
import IEmployeeRepository from "../../../interfaces/repository/admin/employee.repository";
import Employee from "../../../models/employeeModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class EmployeeRepository
  extends CommonBaseRepository<{ employee: Document & IEmployee }>
  implements IEmployeeRepository
{
  constructor() {
    super({ employee: Employee });
  }
  async addNewEmployee(data: IEmplRegData): Promise<IEmplRegData | null> {
    try {
      return this.createData("employee", data);
    } catch (error) {
      throw error;
    }
  }

  async savePasswordResetToken(
    employeeId: string,
    token: string
  ): Promise<void> {
    await this.updateOne(
      "employee",
      { _id: employeeId },
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000, // 1 hour expiry
      },
      { upsert: true }
    );
    return;
  }
}
