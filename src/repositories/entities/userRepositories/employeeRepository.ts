import { Document } from "mongoose";
import { IEmployee } from "../../../interfaces/entities/employee.entity";
import IEmployeeRepository from "../../../interfaces/repository/user/employee.repository";
import Employee from "../../../models/employeeModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class EmployeeRepository
  extends CommonBaseRepository<{ employee: Document & IEmployee }>
  implements IEmployeeRepository
{
  constructor() {
    super({ employee: Employee });
  }

  async fetchEmployeeDetails(employeeId:string):Promise<IEmployee | null>{
    // try {
        console.log(employeeId,"employeeId");
        return this.findById("employee", employeeId).exec();
    // } catch (error) {
        // throw error;
    // }
  }
}

export const employeeRepository = new EmployeeRepository();