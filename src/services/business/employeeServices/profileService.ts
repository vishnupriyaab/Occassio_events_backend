import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { CryptoService } from "../../../integration/cryptoServices";
import { IEmployee } from "../../../interfaces/entities/employee.entity";
import ICryptoService from "../../../interfaces/integration/ICrypto";
import IEmplProfileRepository from "../../../interfaces/repository/employee/profile.repository";
import IEmplProfileService from "../../../interfaces/services/employee/profile.services";
import { AppError } from "../../../middleware/errorHandling";
import { EmplProfileRepository } from "../../../repositories/entities/employeeRepository/profileReposiory";

export class EmplProfileService implements IEmplProfileService {
  private _emplRepository: IEmplProfileRepository;
  private _cryptoService: ICryptoService;
  constructor(
    emplService: IEmplProfileRepository,
    cryptoService: ICryptoService
  ) {
    this._emplRepository = emplService;
    this._cryptoService = cryptoService;
  }

  async showProfile(employeeId: string): Promise<IEmployee> {
    try {
      const employee = await this._emplRepository.findEmplById(employeeId);
      if (!employee) {
        throw new AppError(
          "Employee not found",
          HttpStatusCode.BAD_REQUEST,
          "EmployeeNotFound"
        );
      }
      const employeeProfile = {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        imageUrl: employee.imageUrl,
        isVerified: employee.isVerified,
        isOnline: employee.isOnline,
        assignedUsers: employee.assignedUsers,
        assignedUsersCount: employee.assignedUsersCount,
        resetPasswordToken: employee.resetPasswordToken,
        isBlocked: employee.isBlocked,
      };
      return employeeProfile;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateProfile(
    employeeId: string,
    updateData: Partial<IEmployee>
  ): Promise<IEmployee | null> {
    try {
      const { name, email, password } = updateData;

      if (email) {
        const existingEmployee = await this._emplRepository.findEmplByEmail(
          email
        );
        if (
          existingEmployee &&
          existingEmployee._id.toString() !== employeeId
        ) {
          throw new AppError(
            "Email already in use by another user",
            HttpStatusCode.CONFLICT,
            "EmailAlreadyUse"
          );
        }
      }
      if (password) {
        const hashedPassword = await this._cryptoService.hashData(password);
        updateData.password = hashedPassword;
      }

      const updatedEmployee = await this._emplRepository.updateUserProfile(
        employeeId,
        updateData
      );
      if (!updatedEmployee) {
        throw new AppError(
          "User not found or update failed",
          HttpStatusCode.NOT_FOUND,
          "UserNotFound"
        );
      }

      return updatedEmployee;
    } catch (error:unknown) {
      throw error;
    }
  }

  async updateProfileImage(
    image: string,
    employeeId: string
  ): Promise<IEmployee | null> {
    try {
      console.log(image, "image");
      const updatedEmployee = await this._emplRepository.updateUserProfileImage(
        employeeId,
        image
      );
      console.log(updatedEmployee, "updatedEmployee");
      if (!updatedEmployee) {
        throw new AppError(
          "Employee not found or update failed",
          HttpStatusCode.NOT_FOUND,
          "EmployeeNotFound"
        );
      }
      return updatedEmployee;
    } catch (error) {
      console.error("Error in updateProfileImage:", error);
      throw error;
    }
  }
}

const emplProfileRepository = new EmplProfileRepository();
const cryptoService: ICryptoService = new CryptoService();
export const emplProfileService = new EmplProfileService(
  emplProfileRepository,
  cryptoService
);
