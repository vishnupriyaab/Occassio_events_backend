import { Types } from "mongoose";
import { IEmployee, IEmplRegData } from "../../entities/employee.entity";

export default interface IEmployeeRepository{
    addNewEmployee(data: IEmplRegData): Promise<IEmplRegData | null>
    savePasswordResetToken(employeeId: string | undefined, token: string): Promise<void>;
    findEmployeeWithLeastAssignments(): Promise<IEmployee | null>;
    markEmployeeAsAssigned(employeeId: string, userId: Types.ObjectId| string): Promise<IEmployee | null>;
}