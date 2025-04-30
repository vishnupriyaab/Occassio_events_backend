import IEstimation from "../../../interfaces/entities/estimation.entity";
import IEmplEstimationRepository from "../../../interfaces/repository/employee/estimation.repository";
import IEmplEstimationServices from "../../../interfaces/services/employee/estimation.services";
import { EmplEstimationRepository } from "../../../repositories/entities/employeeRepository/estimationRepository";

export class EmplEstimationServices implements IEmplEstimationServices {
  private _emplEstiRepo: IEmplEstimationRepository;
  constructor(emplEstiRepo: IEmplEstimationRepository) {
    this._emplEstiRepo = emplEstiRepo;
  }

  async saveEstimation(
    estimationData: IEstimation,
    grandTotal: number,
    userId: string,
    employeeId: string
  ): Promise<any> {
    try {
    //   console.log(
    //     "estimationData",
    //     estimationData,
    //     "grandTotal",
    //     grandTotal,
    //     "userId",
    //     userId,
    //     "employeeId",
    //     employeeId
    //   );
      const savedData:IEstimation = {
        userId: userId,
        employeeId: employeeId,
        venue: {
          details: estimationData.venue.details,
          noOf: estimationData.venue.noOf,
          cost: estimationData.venue.cost,
        },
        seating: {
          details: estimationData.seating.details,
          noOf: estimationData.seating.noOf,
          cost: estimationData.seating.cost,
        },
        food: {
          welcomeDrink: {
            details: estimationData.food.welcomeDrink.details,
            noOf:estimationData.food.welcomeDrink.noOf,
            cost: estimationData.food.welcomeDrink.cost,
          },
          mainCourse: {
            details: estimationData.food.mainCourse.details,
            noOf: estimationData.food.mainCourse.noOf,
            cost: estimationData.food.mainCourse.cost,
          },
          dessert: {
            details: estimationData.food.dessert.details,
            noOf: estimationData.food.dessert.noOf,
            cost: estimationData.food.dessert.cost,
          },
        },
        soundSystem: {
          details: estimationData.soundSystem.details,
          noOf: estimationData.soundSystem.noOf,
          cost: estimationData.soundSystem.cost,
        },
        PhotoAndVideo: {
          details: estimationData.PhotoAndVideo.details,
          noOf: estimationData.PhotoAndVideo.noOf,
          cost: estimationData.PhotoAndVideo.cost,
        },
        Decoration: {
          details: estimationData.Decoration.details,
          noOf: estimationData.Decoration.noOf,
          cost: estimationData.Decoration.cost,
        },
        grandTotal: grandTotal,
      };
      console.log(savedData,"qwertyui");
      const savedEstimation = await this._emplEstiRepo.createNewEstimation(savedData);
      return savedEstimation;
    } catch (error) {
      throw error;
    }
  }

  async fetchEstimation(userId:string):Promise<any | null>{
    try {
        const fetchEstimation = await this._emplEstiRepo.fetchEstimation(userId);
        // console.log(fetchEstimation,"service");
        const fetchUserDetails = await this._emplEstiRepo.findUserById(userId);
        const entryId = fetchUserDetails?.entryId;
        const fetchEntryDataDetails = await this._emplEstiRepo.findEntryUserDetails(entryId!);
        console.log(fetchEntryDataDetails,"fetchEntryDataDetails")
        return {fetchEstimation, fetchUserDetails, fetchEntryDataDetails};
    } catch (error) {
        throw error;
    }
  }

}
const emplEstimationRepository = new EmplEstimationRepository();
export const emplEstimationService = new EmplEstimationServices(
  emplEstimationRepository
);
