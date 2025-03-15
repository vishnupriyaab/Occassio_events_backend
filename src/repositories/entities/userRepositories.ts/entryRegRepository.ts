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

  async createEntryReg(
    data: IEntryRegFormData
  ): Promise<IEntryRegFormData | null> {
    try {
      return this.createData("entryRegForm", data);
    } catch (error) {
      throw error;
    }
  }
}

// export const userEntryRegRepository = new EntryRegRepository();
