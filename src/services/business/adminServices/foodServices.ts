import { IFood, IFoodCreate } from "../../../interfaces/entities/food.entity";
import IfoodRepository from "../../../interfaces/repository/admin/food.repository";
import IFoodServices from "../../../interfaces/services/admin/food.services";
import { foodRepository } from "../../../repositories/entities/adminRepositories.ts/foodRepository";

export class foodServices implements IFoodServices {
  private _foodRepo: IfoodRepository;
  constructor( foodRepo: IfoodRepository ) {
    this._foodRepo = foodRepo;
  }

  async getFoods(): Promise<IFood[]> {
    try {
      return await this._foodRepo.getFood();
    } catch (error) {
      throw error;
    }
  }

  async addFood(foodData: IFoodCreate): Promise<IFood> {
    try {
      console.log(foodData, "foodData");
      const existingFood = await this._foodRepo.findFoodByName(
        foodData.name
      );
      if (existingFood) {
        const error = new Error("already existing food");
        error.name = "AlreadyExists";
        throw error;
      }
      const food = {
        name: foodData.name,
        description: foodData.description,
        estimatedCost: {
          max: foodData.endingPrice,
          min: foodData.startingPrice,
        },
        list: foodData.blocked,
      };
      console.log(food, "food");
      const newSeating = await this._foodRepo.addFood(food);
      return newSeating;
    } catch (error) {
      throw error;
    }
  }
  async updateFood(foodId: string, updatedData: any): Promise<IFood | null> {
    try {
      const updatedSeating = await this._foodRepo.updateFood(
        foodId,
        updatedData
      );
      return updatedSeating;
    } catch (error) {
      throw error;
    }
  }
  async deleteFood(foodId: string): Promise<void> {
    try {
      const seating = await this._foodRepo.findFoodById(foodId);
      if (!seating) {
        const error = new Error("Food not found");
        error.name = "FoodNotFound";
        throw error;
      }

      await this._foodRepo.deleteFood(foodId);
      return;
    } catch (error) {
      throw error;
    }
  }
  async isList( foodId: string, updatedData: Partial<IFood> ): Promise<IFood | null> {
    try {
      const food = await this._foodRepo.findFoodById(foodId);
      if (!food) {
        const error = new Error("Food not found");
        error.name = "FoodNotFound";
        throw error;
      }

      return await this._foodRepo.isList(foodId, updatedData);
    } catch (error) {
      throw error;
    }
  }
}

const adminFoodRepository = new foodRepository();
export const adminFoodServices = new foodServices(adminFoodRepository);
