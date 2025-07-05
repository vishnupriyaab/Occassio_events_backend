import { Document } from "mongoose";
import IEntryRegFormData from "../../../interfaces/entities/IEntryFormReg.entity";
import IEntryRegRepository from "../../../interfaces/repository/user/entryReg.repository";
import EntryRegForm from "../../../models/userEntryDetails";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class EntryRegRepository
  extends CommonBaseRepository<{ entryRegForm: Document & IEntryRegFormData }>
  implements IEntryRegRepository
{
  constructor() {
    super({ entryRegForm: EntryRegForm });
  }

  async createEntryReg(data: IEntryRegFormData): Promise<IEntryRegFormData> {
    try {
      const result = await this.createData("entryRegForm", data);
      return result!;
    } catch (error) {
      throw error;
    }
  }

  async updatePaymentStatus(
    entryId: string,
    transactionId: string,
    status: "pending" | "completed" | "failed" | "refund"
  ): Promise<IEntryRegFormData> {
    try {
      const result = await this.updateById("entryRegForm", entryId, {
        "entryPayment.status": status,
        "entryPayment.transactionId": transactionId,
      });
      return result!;
    } catch (error) {
      throw error;
    }
  }

  async findUserById(entryId: string): Promise<IEntryRegFormData> {
    try {
      const result = await this.findById("entryRegForm", entryId);
      return result!;
    } catch (error) {
      throw error;
    }
  }
}
