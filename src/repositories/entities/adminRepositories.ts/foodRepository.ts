import { IFood } from "../../../interfaces/entities/food.entity";
import IfoodRepository from "../../../interfaces/repository/admin/food.repository";
import Food from "../../../models/foodModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class foodRepository
  extends CommonBaseRepository<{ food: Document & IFood }>
  implements IfoodRepository
{
  constructor() {
    super({ food: Food });
  }
  async findFoodByName(foodName: string): Promise<IFood | null> {
    return this.findOne("food", { foodName });
  }
  async  addFood(food: any): Promise<IFood> {
    return this.createData("food", food);
  }
  async getFood(): Promise<IFood[]> {
    return this.findAll("food", {});
  }
  async updateFood( foodId: string, updatedData: Partial<IFood>): Promise<IFood | null> {
    return this.updateById("food", foodId, updatedData);
  }
  async findFoodById(foodId: string): Promise<IFood | null> {
    return this.findById("food", foodId);
  }
  async deleteFood(foodId: string): Promise<void> {
    await this.deleteById("food", foodId);
  }
  async isList(foodId: string, updatedData: Partial<IFood>): Promise<IFood | null> {
    return this.updateById("food", foodId, updatedData);
  }
}
