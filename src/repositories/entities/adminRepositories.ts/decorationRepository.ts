import { IDecoration } from "../../../interfaces/entities/decoration.entity";
import IDecorRepository from "../../../interfaces/repository/admin/decoration.repository";
import Decoration from "../../../models/decorationModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class DecorRepository
  extends CommonBaseRepository<{ decoration: Document & IDecoration }>
  implements IDecorRepository
{
  constructor() {
    super({ decoration: Decoration });
  }
  async findDecorByName(decorationName: string): Promise<IDecoration | null> {
    return this.findOne("decoration", { decorationName });
  }
  async addDecor(decoration: any): Promise<IDecoration> {
    return this.createData("decoration", decoration);
  }
  async getDecor(): Promise<IDecoration[]> {
    return this.findAll("decoration", {});
  }
  async updateDecor( decorationId: string, updatedData: Partial<IDecoration>): Promise<IDecoration | null> {
    return this.updateById("decoration", decorationId, updatedData);
  }
  async findDecorById(decorationId: string): Promise<IDecoration | null> {
    return this.findById("decoration", decorationId);
  }
  async deleteDecor(decorationId: string): Promise<void> {
    await this.deleteById("decoration", decorationId);
  }
  async isList(decorationId: string, updatedData: Partial<IDecoration>): Promise<IDecoration | null> {
    return this.updateById("decoration", decorationId, updatedData);
  }
}
