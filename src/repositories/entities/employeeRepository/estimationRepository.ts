import { Document } from "mongoose";
import IEstimation from "../../../interfaces/entities/estimation.entity";
import IEmplEstimationRepository from "../../../interfaces/repository/employee/estimation.repository";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import Estimation from "../../../models/estimationModel";
import IEntryRegFormData from "../../../interfaces/entities/IEntryFormReg.entity";
import EntryRegForm from "../../../models/userEntryDetails";
import { IUser } from "../../../interfaces/entities/user.entity";
import User from "../../../models/userModel";

export class EmplEstimationRepository
  extends CommonBaseRepository<{
    estimation: IEstimation & Document;
    entryRegForm: Document & IEntryRegFormData;
    user: IUser & Document
  }>
  implements IEmplEstimationRepository
{
  constructor() {
    super({ estimation: Estimation, entryRegForm: EntryRegForm, user: User });
  }

  async createNewEstimation(data: IEstimation): Promise<IEstimation> {
    try {
      return this.createData("estimation", data);
    } catch (error) {
      throw error;
    }
  }

  async fetchEstimation(userId: string): Promise<IEstimation> {
    try {
      const estimation = await this.findOne("estimation", { userId });
      return estimation!;
    } catch (error) {
      throw error;
    }
  }

  async findUserById(userId: string): Promise<IUser> {
    try {
      const result = await this.findOne("user", { _id: userId });
      console.log(result,"User in repo");
      return result!;
    } catch (error) {
      throw error;
    }
  }

  async findEntryUserDetails(entryId: string): Promise<IEntryRegFormData> {
    try {
      console.log("12345")
      const entryDetails = await this.findOne("entryRegForm", { _id: entryId });
      console.log(entryDetails,"entryDetails in repo");
      return entryDetails!;
    } catch (error) {
      throw error;
    }
  }
}
