import { Document, FilterQuery, Types } from "mongoose";
import {
  IEmployee,
  IEmplRegData,
} from "../../../interfaces/entities/employee.entity";
import IEmployeeRepository from "../../../interfaces/repository/admin/employee.repository";
import Employee from "../../../models/employeeModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class EmployeeRepository
  extends CommonBaseRepository<{ employee: Document & IEmployee }>
  implements IEmployeeRepository
{
  constructor() {
    super({ employee: Employee });
  }
  async addNewEmployee(data: IEmplRegData): Promise<IEmplRegData | null> {
    try {
      return this.createData("employee", data);
    } catch (error) {
      throw error;
    }
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

  async findEmployeeWithLeastAssignments(): Promise<IEmployee | null> {
    try {
      const employee = await this.findOne("employee", {
        isBlocked: false,
        isVerified: true,
      })
        .sort({ assignedUsersCount: 1 })
        .limit(1);

      if (!employee) {
        return this.findOne("employee", {
          isBlocked: false,
        })
          .sort({ assignedUsersCount: 1 })
          .limit(1);
      }
      console.log(employee, "employeeeeeeeeeeeeeeeeeeee");
      return employee;
    } catch (error) {
      console.error("Error finding unassigned employee:", error);
      throw error;
    }
  }

  async markEmployeeAsAssigned(
    employeeId: string,
    userId: Types.ObjectId | string
  ): Promise<IEmployee | null> {
    try {
      return await this.updateById("employee", employeeId, {
        $addToSet: { assignedUsers: userId },
        $inc: { assignedUsersCount: 1 }
      });
    } catch (error) {
      console.error("Error marking employee as assigned:", error);
      throw error;
    }
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
      console.log(searchTerm, filterStatus, page, limit, "inRepository");

      const query: FilterQuery<IEmployee> = {};

      if (searchTerm?.trim()) {
        query.name = { $regex: searchTerm.trim(), $options: "i" };
      }

      let status = filterStatus;
      try {
        if (
          filterStatus &&
          typeof filterStatus === "string" &&
          filterStatus.startsWith("{")
        ) {
          const parsedFilter = JSON.parse(filterStatus);
          status = parsedFilter.status;
        }
      } catch (e) {
        console.error("Error parsing filterStatus:", e);
        status = "all";
      }

      if (status && status !== "all") {
        query.isBlocked = status === "blocked";
      }

      const skip = Math.max(0, (page - 1) * limit);

      const [employees, totalEmployees] = await Promise.all([
        this.findMany("employee", query, { skip, limit, sort: { createdAt: -1 } }),
        this.count("employee", query),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalEmployees / limit));

      return {
        employees,
        totalEmployees,
        totalPages: totalPages,
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }

}
