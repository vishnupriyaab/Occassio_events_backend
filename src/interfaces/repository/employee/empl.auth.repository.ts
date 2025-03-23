import { IEmployee } from "../../entities/employee.entity";

export default interface IEmplAuthRepository {
  findEmplByEmail(email: string): Promise<IEmployee | null>;
  savePasswordResetToken(employeeId: string, token: string): Promise<void>;
  findEmplById(employeeId: string): Promise<IEmployee | null>;
  getPasswordResetToken(employeeId: string): Promise<string | null>;
  updatePassword(employeeId: string, hashedPassword: string): Promise<void>;
  clearPasswordResetToken(employeeId: string): Promise<void>;
  updateActivatedStatus(
    email: string,
    isVerified: boolean
  ): Promise<IEmployee | null>;
}
