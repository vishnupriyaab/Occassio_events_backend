import { IEmployee } from "../../entities/employee.entity";

export default interface IEmplProfileService {
  showProfile(employeeId: string): Promise<IEmployee>;
  updateProfile(
    employeeId: string,
    updateData: Partial<IEmployee>
  ): Promise<IEmployee | null>;
  updateProfileImage(
    image: string,
    employeeId: string
  ): Promise<IEmployee | null>;
}
