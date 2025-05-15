import IEstimation from "../../../interfaces/entities/estimation.entity";
import IUserEstimationRepository from "../../../interfaces/repository/user/estimation.repository";
import IUserEstimationService from "../../../interfaces/services/user/estimation.services";
import { UserEstimationRepository } from "../../../repositories/entities/userRepositories/estimationRepository";

export class UserEstimationService implements IUserEstimationService {
  private _userEstiRepo: IUserEstimationRepository;
  constructor(userEstiRepo: IUserEstimationRepository) {
    this._userEstiRepo = userEstiRepo;
  }

  async fetchEstimation(userId: string): Promise<any> {
    try {
      const fetchEstimation = await this._userEstiRepo.fetchEstimation(userId);
      //   return fetchEstimation!;
      const fetchUserDetails = await this._userEstiRepo.findUserById(userId);
      const entryId = fetchUserDetails?.entryId;
      const fetchEntryDataDetails = await this._userEstiRepo.findEntryUserDetails(entryId!);
      console.log(fetchEntryDataDetails, "fetchEntryDataDetails");
      return { fetchEstimation, fetchUserDetails, fetchEntryDataDetails };
    } catch (error) {
      throw error;
    }
  }
}
const userEstiRepo = new UserEstimationRepository();
export const userEstiService = new UserEstimationService(userEstiRepo);
