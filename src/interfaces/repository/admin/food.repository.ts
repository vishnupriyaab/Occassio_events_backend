import { IFood } from "../../entities/food.entity"

export default interface IfoodRepository{
    findFoodByName(foodName: string): Promise<IFood | null>
    addFood(food: any): Promise<IFood>
    getFood(): Promise<IFood[]>
    updateFood( foodId: string, updatedData: Partial<IFood>): Promise<IFood | null>
    findFoodById(foodId: string): Promise<IFood | null>
    deleteFood(foodId: string): Promise<void>
    isList(foodId: string, updatedData: Partial<IFood>): Promise<IFood | null>
}