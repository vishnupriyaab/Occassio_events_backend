import { IEmplRegData } from "../../entities/employee.entity";

export default interface IEmployeeService{
    addEmployee(employeeData: IEmplRegData): Promise<IEmplRegData | null>
}