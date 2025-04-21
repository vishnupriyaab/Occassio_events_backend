import { IEmployee } from "../../../interfaces/entities/employee.entity";
import IEmployeeRepository from "../../../interfaces/repository/user/employee.repository";
import IEmployeeServices from "../../../interfaces/services/user/employee.services";
import { employeeRepository } from "../../../repositories/entities/userRepositories.ts/employeeRepository";

export class EmployeeService implements IEmployeeServices {
  private _employeeRepository: IEmployeeRepository;
  constructor(employeeRepository: IEmployeeRepository) {
    this._employeeRepository = employeeRepository;
  }

  async getEmployeeDetails(employeeId: string): Promise<IEmployee | null> {
    try {
        const employeeDetails = await this._employeeRepository.fetchEmployeeDetails(employeeId);
        console.log(employeeDetails,"000000000000000")
        return employeeDetails;
    } catch (error: unknown) {
      throw error; 
    }
  }
}

export const employeeService = new EmployeeService(employeeRepository);
