import { Types } from "mongoose";
import { IEmployee, IEmplRegData } from "../../entities/employee.entity";

export default interface IEmployeeRepository{
    addNewEmployee(data: IEmplRegData): Promise<IEmplRegData | null>
    savePasswordResetToken(employeeId: string | undefined, token: string): Promise<void>;
    findEmployeeWithLeastAssignments(): Promise<IEmployee | null>;
    markEmployeeAsAssigned(employeeId: string, userId: Types.ObjectId| string): Promise<IEmployee | null>;
    fetchEmployee(
        searchTerm: string,
        filterStatus: string | undefined,
        page: number,
        limit: number
      ): Promise<{
        employees: IEmployee[];
        totalEmployees: number;
        totalPages: number;
        currentPage: number;
      }>
      findByEmployeeId(id: string): Promise<IEmployee | null>
      updateEmployee(
        id: string,
        updatedData: Partial<IEmployee>
      ): Promise<IEmployee | null>
      deleteEmployee(id: string): Promise<void>
}