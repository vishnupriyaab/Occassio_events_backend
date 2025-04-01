import { Types } from "mongoose";
import { IEmployee } from "../../entities/employee.entity";
import { IUser } from "../../entities/user.entity";
import IEntryRegFormData from "../../entities/IEntryFormReg.entity";

export default interface IClientRepository{
    findEmployeeById(employeeId: string):Promise<IEmployee | null>
    findAssignedUsers(userIds: Types.ObjectId[]): Promise<IUser[]>
    findEntryRegFormById(entryId: string): Promise<IEntryRegFormData | null>
}