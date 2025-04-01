import { Document, Types } from "mongoose";
import { IUser } from "../../../interfaces/entities/user.entity";
import IClientRepository from "../../../interfaces/repository/employee/client.repository";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import User from "../../../models/userModel";
import { IEmployee } from "../../../interfaces/entities/employee.entity";
import IEntryRegFormData from "../../../interfaces/entities/IEntryFormReg.entity";
import Employee from "../../../models/employeeModel";
import EntryRegForm from "../../../models/userEntryDetails";

export class ClientRepository
  extends CommonBaseRepository<{ client: Document & IUser ; employee: Document & IEmployee; entryRegForm: Document & IEntryRegFormData}>
  implements IClientRepository
{
  constructor() {
    super({ client: User , employee: Employee, entryRegForm: EntryRegForm});
  }
  async findEmployeeById(employeeId: string): Promise<IEmployee | null> {
    return this.findById("employee", employeeId);
  }

  async findAssignedUsers(userIds: Types.ObjectId[]): Promise<IUser[]> {
    return this.findMany("client", {
      _id: { $in: userIds },
      isBlocked: false
    });
  }

  async findEntryRegFormById(entryId: string): Promise<IEntryRegFormData | null> {
    return this.findById("entryRegForm", entryId);
  }
}
