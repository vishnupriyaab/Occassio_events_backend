import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { CryptoService } from "../../../integration/cryptoServices";
import { EmailService } from "../../../integration/emailServices";
import { JWTService } from "../../../integration/jwtServices";
import { IsAuthenticatedUseCaseRES } from "../../../interfaces/common/IIsAuthenticated";
import { IEmployee } from "../../../interfaces/entities/employee.entity";
import ICryptoService from "../../../interfaces/integration/ICrypto";
import { IEmailService } from "../../../interfaces/integration/IEmail";
import { IJWTService, JWTPayload } from "../../../interfaces/integration/IJwt";
import IEmplAuthRepository from "../../../interfaces/repository/employee/empl.auth.repository";
import IEmplAuthService from "../../../interfaces/services/employee/empl.auth.services";
import { AppError } from "../../../middleware/errorHandling";
import { EmplAuthRepository } from "../../../repositories/entities/employeeRepository/authRepository";
import bcrypt from "bcrypt";

export class EmploAuthService implements IEmplAuthService {
  private _emplRepo: IEmplAuthRepository;
  private _cryptoService: ICryptoService;
  private _jwtService: IJWTService;
  private _emailService: IEmailService;
  constructor(
    emplRepo: IEmplAuthRepository,
    emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    },
    jwtService: IJWTService,
    cryptoService: ICryptoService
  ) {
    this._emailService = new EmailService(emailConfig);
    this._emplRepo = emplRepo;
    this._cryptoService = cryptoService;
    this._jwtService = jwtService;
  }

  async loginEmployee(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const employee = await this._emplRepo.findEmplByEmail(email);
      console.log(employee,"employeeee")
      if (!employee) {
        throw new AppError(
          "Employee not found",
          HttpStatusCode.NOT_FOUND,
          "EmployeeNotFound"
        );
      }

      if (!employee.isVerified) {
        await this._emplRepo.updateActivatedStatus(email, true);
      }

      if (employee.isBlocked) {
        throw new AppError(
          "Your account is blocked",
          HttpStatusCode.BAD_REQUEST,
          "AccountIsBlocked"
        );
      }
      console.log(password,"passworddd", employee.password)
      
      const isPasswordValid = await bcrypt.compare(
        password,
        employee.password as string
      );
      if (!isPasswordValid) {
        throw new AppError(
          "Invalid password",
          HttpStatusCode.BAD_REQUEST,
          "InvalidPassword"
        );
      }
      const payload = { id: employee._id, role: "employee", name: employee.name };
      const accessToken = this._jwtService.generateAccessToken(payload);
      const refreshToken = this._jwtService.generateRefreshToken(payload);
      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const employee: IEmployee | null = await this._emplRepo.findEmplByEmail(
        email
      );
      if (!employee) {
        console.log("qwert");
        throw new AppError(
          "Employee not found!",
          HttpStatusCode.NOT_FOUND,
          "EmployeeNotFound"
        );
      }

      const token = this._jwtService.generateAccessToken({
        id: employee._id,
        role: "employee",
        name: employee.name
      });
      await this._emplRepo.savePasswordResetToken(employee._id, token);
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await this._emailService.sendPasswordResetEmail(email, resetLink);
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = this._jwtService.verifyAccessToken(token);

      if (!decoded.id) {
        throw new AppError(
          "Invalid reset token",
          HttpStatusCode.BAD_REQUEST,
          "InvalidResetToken"
        );
      }

      const employee = await this._emplRepo.findEmplById(decoded.id);
      if (!employee) {
        throw new AppError(
          "Employee not found",
          HttpStatusCode.NOT_FOUND,
          "EmployeeNotFound"
        );
      }

      const storedToken = await this._emplRepo.getPasswordResetToken(
        decoded.id
      );
      if (!storedToken || storedToken !== token) {
        throw new AppError(
          "Invalid or expired reset token",
          HttpStatusCode.BAD_REQUEST,
          "InvalidOrExpiredResetToken"
        );
      }

      const hashedPassword = await this._cryptoService.hashData(newPassword);
      await this._emplRepo.updatePassword(decoded.id, hashedPassword);
      await this._emplRepo.clearPasswordResetToken(decoded.id);
    } catch (error) {
      throw error;
    }
  }
}

const emplAuthRepository = new EmplAuthRepository();
const IjwtService: IJWTService = new JWTService();
const cryptoService: ICryptoService = new CryptoService();
const emailConfig = {
  user: process.env.EMAIL_COMPANY,
  pass: process.env.EMAIL_PASS,
  frontendUrl: process.env.FRONTEND_URL,
};

export const adminAuthServices = new EmploAuthService(
  emplAuthRepository,
  emailConfig,
  IjwtService,
  cryptoService
);
