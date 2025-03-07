import { ISeating } from "../../../interfaces/entities/seating.entity";
import ISeatingRepository from "../../../interfaces/repository/admin/seating.repository";
import Seating from "../../../models/seatingModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class seatingRepository
  extends CommonBaseRepository<{ seating: Document & ISeating }>
  implements ISeatingRepository
{
  constructor() {
    super({ seating: Seating });
  }
  async findSeatingByName(seatingName: string): Promise<ISeating | null> {
    return this.findOne("seating", { seatingName });
  }
  async addSeating(seating: any): Promise<ISeating> {
    return this.createData("seating", seating);
  }
  async getSeatings(): Promise<ISeating[]> {
    return this.findAll("seating", {});
  }
  async updateSeating( seatingId: string, updatedData: Partial<ISeating>): Promise<ISeating | null> {
    return this.updateById("seating", seatingId, updatedData);
  }
  async findSeatingById(seatingId: string): Promise<ISeating | null> {
    return this.findById("seating", seatingId);
  }
  async deleteSeating(seatingId: string): Promise<void> {
    await this.deleteById("seating", seatingId);
  }
  async isList(seatingId: string, updatedData: Partial<ISeating>): Promise<ISeating | null> {
    return this.updateById("seating", seatingId, updatedData);
  }
}
