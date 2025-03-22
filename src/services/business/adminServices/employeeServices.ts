import { EmailService } from "../../../integration/emailServices";
import { IEmplRegData } from "../../../interfaces/entities/employee.entity";
import { IEmailService } from "../../../interfaces/integration/IEmail";
import IEmployeeRepository from "../../../interfaces/repository/admin/employee.repository";
import IEmployeeService from "../../../interfaces/services/admin/employee.services";
import { EmployeeRepository } from "../../../repositories/entities/adminRepositories.ts/employeeRepository";

export class EmployeeService implements IEmployeeService {
  private _emplRepository: IEmployeeRepository;
  private _emailService: IEmailService;
  constructor(
    employeeRepo: IEmployeeRepository,
    emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    }
  ) {
    this._emplRepository = employeeRepo;
    this._emailService = new EmailService(emailConfig);
  }

  async addEmployee(employeeData: IEmplRegData): Promise<IEmplRegData | null> {
    try {
      const savedEmployee = await this._emplRepository.addNewEmployee(employeeData);
      
      if (savedEmployee) {
        await this._emailService.sendEmployeeOnboardingEmail(
          savedEmployee.name,
          savedEmployee.email
        );
      }
      
      return savedEmployee;
    } catch (error) {
      console.error("Error in adding employee:", error);
      throw error;
    }
  }

}

const emailConfig = {
    user: process.env.EMAIL_COMPANY,
    pass: process.env.EMAIL_PASS,
    frontendUrl: process.env.FRONTEND_URL,
  };
const adminEmplRepository = new EmployeeRepository();
export const adminEmplServices = new EmployeeService(adminEmplRepository, emailConfig);
