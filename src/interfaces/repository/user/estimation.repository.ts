import IEstimation from "../../entities/estimation.entity";
import IEntryRegFormData from "../../entities/IEntryFormReg.entity";
import { IUser } from "../../entities/user.entity";

export default interface IUserEstimationRepository {
  fetchEstimation(userId: string): Promise<IEstimation>;
  findUserById(userId: string): Promise<IUser>
  findEntryUserDetails(entryId: string): Promise<IEntryRegFormData>
}
