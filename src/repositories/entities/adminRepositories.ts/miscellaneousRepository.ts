import { IMiscellaneous } from "../../../interfaces/entities/miscellaneous.entity";
import IMiscellaneousRepository from "../../../interfaces/repository/admin/miscellaneous.repository";
import Miscellaneous from "../../../models/miscellaneousModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class MiscellaneousRepository
  extends CommonBaseRepository<{ miscellaneous: Document & IMiscellaneous }>
  implements IMiscellaneousRepository
{
  constructor() {
    super({ miscellaneous: Miscellaneous })
  }
  async findMiscellaneousByName(miscellaneousName: string): Promise<IMiscellaneous | null> {
    return this.findOne("miscellaneous", { miscellaneousName })
  }
  async addMiscellaneous(miscellaneous: any): Promise<IMiscellaneous> {
    return this.createData("miscellaneous", miscellaneous)
  }
  async getMiscellaneous(): Promise<IMiscellaneous[]> {
    return this.findAll("miscellaneous", {})
  }
  async updateMiscellaneous( miscellaneousId: string, updatedData: Partial<IMiscellaneous>): Promise<IMiscellaneous | null> {
    return this.updateById("miscellaneous", miscellaneousId, updatedData);
  }
  async findMiscellaneousById(miscellaneousId: string): Promise<IMiscellaneous | null> {
    return this.findById("miscellaneous", miscellaneousId)
  }
  async deleteMiscellaneous(miscellaneousId: string): Promise<void> {
    await this.deleteById("miscellaneous", miscellaneousId)
  }
  async isList( miscellaneousId: string, updatedData: Partial<IMiscellaneous> ): Promise<IMiscellaneous | null> {
    return this.updateById("miscellaneous", miscellaneousId, updatedData)
  }
}
