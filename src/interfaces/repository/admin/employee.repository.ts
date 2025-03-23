import { IEmplRegData } from "../../entities/employee.entity";

export default interface IEmployeeRepository{
    addNewEmployee(data: IEmplRegData): Promise<IEmplRegData | null>
    savePasswordResetToken(employeeId: string | undefined, token: string): Promise<void>;
}