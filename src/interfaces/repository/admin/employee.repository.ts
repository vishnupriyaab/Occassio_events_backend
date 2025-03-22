import { IEmplRegData } from "../../entities/employee.entity";

export default interface IEmployeeRepository{
    addNewEmployee(data: IEmplRegData): Promise<IEmplRegData | null>
}