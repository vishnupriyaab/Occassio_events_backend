import { IEmployee } from "../../entities/employee.entity";
import { IUser } from "../../entities/user.entity";

export default interface IUserRepository {
  fetchUser(
    searchTerm: string,
    filterStatus: string | undefined,
    page: number,
    limit: number
  ): Promise<{
    users: IUser[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  }>;
  findByClientId(id: string): Promise<IUser | null>;
  updateClient(id: string, updatedData: Partial<IUser>): Promise<IUser | null>;
}
