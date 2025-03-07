import { IFood, IFoodCreate } from "../../entities/food.entity"

export default interface IFoodServices{
    getFoods(): Promise<IFood[]>
    addFood(foodData: IFoodCreate): Promise<IFood>
    updateFood(foodId: string, updatedData: any): Promise<IFood | null>
    deleteFood(foodId: string): Promise<void>
    isList( foodId: string, updatedData: Partial<IFood> ): Promise<IFood | null>
}