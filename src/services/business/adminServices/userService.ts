import { IUser } from "../../../interfaces/entities/user.entity";
import IUserRepository from "../../../interfaces/repository/admin/user.repository";
import IUserService from "../../../interfaces/services/admin/user.services";
import { UserRepository } from "../../../repositories/entities/adminRepositories.ts/userRepository";

export class UserService implements IUserService {
  private _userRepo: IUserRepository;
  constructor(userRepo: IUserRepository) {
    this._userRepo = userRepo
  }

  async fetchUser(
    searchTerm: string,
    filterStatus: string | undefined,
    page: number,
    limit: number
  ): Promise<{
    users: IUser[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      if (page < 1 || limit < 1) {
        const error = new Error("Invalid Page Or Limit");
        error.name = "InvalidPageOrLimit";
        throw error;
      }

      return await this._userRepo.fetchUser(
        searchTerm,
        filterStatus,
        page,
        limit
      );
    } catch (error) {
      throw error;
    }
  }

     //blockclient
     async blockClient(clientId: string): Promise<IUser | null> {
      try {
        const client = await this._userRepo.findByClientId(clientId);
        if (!client) {
          const error = new Error('Client not found');
          error.name = 'ClientNotFound'
          throw error;
        }
  
        client.isBlocked = !client.isBlocked;
        return await this._userRepo.updateClient(clientId, {
          isBlocked: client.isBlocked,
        });
      } catch (error: unknown) {
        throw error;
      }
    }

}

const adminUserRepository = new UserRepository();
export const adminUserService = new UserService(adminUserRepository)