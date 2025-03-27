import { IUser } from "../../entities/user.entity";

export default interface IUserRepository {
  createUser(userData: IUser): Promise<IUser | null>;
  updateUserAssignedEmployee(
    userId: string,
    employeeId: string
  ): Promise<IUser | null>;
  savePasswordResetToken(
    userId: string | undefined,
    token: string
  ): Promise<void>;
  findUserById(userId: string): Promise<IUser | null>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  getPasswordResetToken(userId: string): Promise<string | null>;
  clearPasswordResetToken(userId: string): Promise<void>;
  findUserByEmail(email: string): Promise<IUser | null>
  updateActivatedStatus(
    email: string,
    isVerified: boolean
  ): Promise<IUser | null>
}
