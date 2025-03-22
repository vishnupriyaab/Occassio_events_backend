import { Document } from "mongoose";
import { IEmployee } from "../../../interfaces/entities/employee.entity";
import IEmplAuthRepository from "../../../interfaces/repository/employee/empl.auth.repository";
import Employee from "../../../models/employeeModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class EmplAuthRepository extends CommonBaseRepository<{ employee: Document & IEmployee }>
implements IEmplAuthRepository
{
constructor() {
  super({ employee: Employee });
}

  async findEmplByEmail(email: string): Promise<IEmployee | null> {
    return this.findOne("employee", { email });
  }
  async savePasswordResetToken(
    employeeId: string,
    token: string
  ): Promise<void> {
    await this.updateOne(
      "employee",
      { _id: employeeId },
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000, // 1 hour expiry
      },
      { upsert: true }
    );
    return;
  }

  async findEmplById(employeeId: string): Promise<IEmployee | null> {
    return this.findById("employee", employeeId);
  }

  async getPasswordResetToken(employeeId: string): Promise<string | null> {
    const employee = await this.findById("employee", employeeId)
      .select("resetPasswordToken")
      .exec();
    return employee?.resetPasswordToken || null;
  }

  async updatePassword(
    employeeId: string,
    hashedPassword: string
  ): Promise<void> {
    const result = await this.updateById("employee", employeeId, {
      password: hashedPassword,
    });

    if (!result) {
      throw new Error("Failed to update password");
    }
  }

  async clearPasswordResetToken(employeeId: string): Promise<void> {
    try {
      await this.updateById("employee", employeeId, {
        $unset: { resetPasswordToken: 1 },
      });
    } catch (error) {
      throw error;
    }
  }
}
