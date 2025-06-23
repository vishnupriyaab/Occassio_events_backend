import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import IUserEstimationRepository from "../../../interfaces/repository/user/estimation.repository";
import IUserEstimationService from "../../../interfaces/services/user/estimation.services";
import { AppError } from "../../../middleware/errorHandling";
import { UserEstimationRepository } from "../../../repositories/entities/userRepositories/estimationRepository";

export class UserEstimationService implements IUserEstimationService {
  private _userEstiRepo: IUserEstimationRepository;
  constructor(userEstiRepo: IUserEstimationRepository) {
    this._userEstiRepo = userEstiRepo;
  }

  async fetchEstimation(userId: string): Promise<any> {
    try {
      const fetchEstimation = await this._userEstiRepo.fetchEstimation(userId);

      // if (!fetchEstimation) {
      //   throw new AppError(
      //     "Estimation not found",
      //     HttpStatusCode.NOT_FOUND,
      //     "EstimationNotFound"
      //   );
      // }

      const fetchUserDetails = await this._userEstiRepo.findUserById(userId);
      if (!fetchUserDetails) {
        throw new AppError(
          "User details not found",
          HttpStatusCode.NOT_FOUND,
          "UserDetailsNotFound"
        );
      }
      const entryId = fetchUserDetails?.entryId;
      if (!entryId) {
        throw new AppError(
          "Entry Id not found",
          HttpStatusCode.NOT_FOUND,
          "EntryIdNotFound"
        );
      }
      console.log(entryId,"entryId");

      const fetchEntryDataDetails =
        await this._userEstiRepo.findEntryUserDetails(entryId!);
        console.log(fetchEntryDataDetails,"fetchEntryDataDetails")
      if (!fetchEntryDataDetails) {
        throw new AppError(
          "Entry data details not found",
          HttpStatusCode.NOT_FOUND,
          "EntryDataDetailsNotFound"
        );
      }
      console.log(fetchEntryDataDetails, "fetchEntryDataDetails");
      return { fetchEstimation, fetchUserDetails, fetchEntryDataDetails };
    } catch (error:unknown) {
      throw error;
    }
  }
}
const userEstiRepo = new UserEstimationRepository();
export const userEstiService = new UserEstimationService(userEstiRepo);
