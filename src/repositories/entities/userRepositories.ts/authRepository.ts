import { Document } from "mongoose";
import { IUser } from "../../../interfaces/entities/user.entity";
import User from "../../../models/userModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import IUserRepository from "../../../interfaces/repository/user/auth.repository";

export class UserRepository
  extends CommonBaseRepository<{ user: Document & IUser }>
  implements IUserRepository
{
  constructor() {
    super({ user: User });
  }
  async createUser(userData: IUser): Promise<IUser | null> {
    try {
      console.log("aaaaaaaaaaaaaaaaaaa");
      return this.createData("user", userData);
    } catch (error) {
      throw error;
    }
  }
  async updateUserAssignedEmployee(
    userId: string,
    employeeId: string
  ): Promise<IUser | null> {
    try {
      return this.updateById("user", userId, {
        assignedEmployee: employeeId,
      });
    } catch (error) {
      console.error("Error updating user's assigned employee:", error);
      throw error;
    }
  }
  async savePasswordResetToken(userId: string, token: string): Promise<void> {
      await this.updateOne(
          "user",
          { _id: userId },
          {
              resetPasswordToken: token,
              resetPasswordExpires: Date.now() + 3600000, // 1 hour expiry
            },
            { upsert: true }
        );
        return;
    }
    async findUserById(userId: string): Promise<IUser | null> {
      return this.findById("user", userId);
    }
    async getPasswordResetToken(userId: string): Promise<string | null> {
      const user = await this.findById("user", userId)
        .select("resetPasswordToken")
        .exec();
      return user?.resetPasswordToken || null;
    }
    async updatePassword(
        userId: string,
        hashedPassword: string
      ): Promise<void> {
        const result = await this.updateById("user", userId, {
          password: hashedPassword,
        });
    
        if (!result) {
          throw new Error("Failed to update password");
        }
      }
    
      async clearPasswordResetToken(userId: string): Promise<void> {
        try {
          await this.updateById("user", userId, {
            $unset: { resetPasswordToken: 1 },
          });
        } catch (error) {
          throw error;
        }
      }

        async findUserByEmail(email: string): Promise<IUser | null> {
          return this.findOne("user", { email });
        }
}
