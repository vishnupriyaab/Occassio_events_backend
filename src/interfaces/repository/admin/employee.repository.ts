import { IEmployee, IEmplRegData } from "../../entities/employee.entity";

export default interface IEmployeeRepository{
    addNewEmployee(data: IEmplRegData): Promise<IEmplRegData | null>
    savePasswordResetToken(employeeId: string | undefined, token: string): Promise<void>;
    findUnassignedEmployee(): Promise<IEmployee | null>;
    markEmployeeAsAssigned(employeeId: string): Promise<void>;
}