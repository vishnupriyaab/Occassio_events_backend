import IEstimation from "../../entities/estimation.entity";
import IEntryRegFormData from "../../entities/IEntryFormReg.entity";
import { IUser } from "../../entities/user.entity";

export default interface IEmplEstimationRepository{
    createNewEstimation(data: IEstimation): Promise<IEstimation>
    fetchEstimation(userId:string):Promise<IEstimation>
    findUserById(userId: string): Promise<IUser | null>
    findEntryUserDetails(entryId: string): Promise<IEntryRegFormData>
}