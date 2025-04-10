import { Document } from "mongoose";
import IEntryRegFormData from "../../../interfaces/entities/IEntryFormReg.entity";
import IEntryRegRepository from "../../../interfaces/repository/user/entryReg.repository";
import EntryRegForm from "../../../models/userEntryDetails";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import { IConverationModel } from "../../../interfaces/entities/chat.entity";

export class EntryRegRepository
  extends CommonBaseRepository<{ entryRegForm: Document & IEntryRegFormData }>
  implements IEntryRegRepository
{
  constructor() {
    super({ entryRegForm: EntryRegForm });
  }

  async createEntryReg(
    data: IEntryRegFormData
  ): Promise<IEntryRegFormData | null> {
    try {
      return this.createData("entryRegForm", data);
    } catch (error) {
      throw error;
    }
  }
  // async createRoom(
  //   data: IConverationModel
  // ): Promise<IConverationModel | null> {
  //   try {
  //     return this.createData("entryRegForm", data);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async updatePaymentStatus(
    entryId: string,
    transactionId: string,
    status: "pending" | "completed" | "failed" | "refund"
  ): Promise<IEntryRegFormData | null> {
    try {
      return this.updateById("entryRegForm", entryId, {
        "entryPayment.status": status,
        "entryPayment.transactionId": transactionId,
      });
    } catch (error) {
      throw error;
    }
  }

  async findUserById(entryId: string): Promise<IEntryRegFormData | null> {
    return this.findById("entryRegForm", entryId);
  }
  
}
