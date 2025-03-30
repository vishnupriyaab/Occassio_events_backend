import { IUser } from "../../entities/user.entity";

export default interface IUserService {
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
  blockClient(clientId: string): Promise<IUser | null>
}
