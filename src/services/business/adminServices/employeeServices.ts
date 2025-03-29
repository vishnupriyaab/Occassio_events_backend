import { EmailService } from "../../../integration/emailServices";
import { JWTService } from "../../../integration/jwtServices";
import { IEmployee, IEmplRegData } from "../../../interfaces/entities/employee.entity";
import { IEmailService } from "../../../interfaces/integration/IEmail";
import { IJWTService } from "../../../interfaces/integration/IJwt";
import IEmployeeRepository from "../../../interfaces/repository/admin/employee.repository";
import IEmployeeService from "../../../interfaces/services/admin/employee.services";
import { EmployeeRepository } from "../../../repositories/entities/adminRepositories.ts/employeeRepository";

export class EmployeeService implements IEmployeeService {
  private _emplRepository: IEmployeeRepository;
  private _emailService: IEmailService;
  private _jwtService: IJWTService;
  constructor(
    employeeRepo: IEmployeeRepository,
    emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    },
    jwtService: IJWTService
  ) {
    this._emplRepository = employeeRepo;
    this._emailService = new EmailService(emailConfig);
    this._jwtService = jwtService;
  }

  async fetchEmployee(
    searchTerm: string,
    filterStatus: string | undefined,
    page: number,
    limit: number
  ): Promise<{
    employees: IEmployee[];
    totalEmployees: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      if (page < 1 || limit < 1) {
        const error = new Error("Invalid Page Or Limit");
        error.name = "InvalidPageOrLimit";
        throw error;
      }

      return await this._emplRepository.fetchEmployee(
        searchTerm,
        filterStatus,
        page,
        limit
      );
    } catch (error) {
      throw error;
    }
  }

  async addEmployee(employeeData: IEmplRegData): Promise<IEmplRegData | null> {
    try {
      const savedEmployee = await this._emplRepository.addNewEmployee(
        employeeData
      );

      console.log(savedEmployee, "1234567890123456789123456789234567892345678");

      if (savedEmployee) {
        const token = this._jwtService.generateAccessToken({
          id: savedEmployee._id || "",
          role: "employee",
        });
        console.log(token,"00000000000000000000000000000000000");
        const decode = this._jwtService.verifyAccessToken(token)
        console.log(decode,"11111111111111111111111111111111")
        await this._emplRepository.savePasswordResetToken(savedEmployee._id, token);
        await this._emailService.sendEmployeeOnboardingEmail(
          savedEmployee.name,
          savedEmployee.email,
          token
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
const IjwtService: IJWTService = new JWTService();
export const adminEmplServices = new EmployeeService(
  adminEmplRepository,
  emailConfig,
  IjwtService
);
