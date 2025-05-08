import IEstimation from "../../entities/estimation.entity";

export default interface IUserEstimationService {
  fetchEstimation(userId: string): Promise<IEstimation>;
}
