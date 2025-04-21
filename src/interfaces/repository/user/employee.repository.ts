import { IEmployee } from "../../entities/employee.entity";

export default interface IEmployeeRepository{
    fetchEmployeeDetails(employeeId:string):Promise<IEmployee | null>
}