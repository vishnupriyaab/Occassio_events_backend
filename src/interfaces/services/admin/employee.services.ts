import { IEmployee, IEmplRegData } from "../../entities/employee.entity";

export default interface IEmployeeService{
    addEmployee(employeeData: IEmplRegData): Promise<IEmplRegData | null>
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
      blockEmployee(employeeId: string): Promise<IEmployee | null>
      deleteEmployee(employeeId: string): Promise<void>
}