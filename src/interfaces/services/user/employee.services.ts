import { IEmployee } from "../../entities/employee.entity";

export default interface IEmployeeServices {
  getEmployeeDetails(employeeId: string): Promise<IEmployee | null>;
}
