import { ISeating } from "../../entities/seating.entity";

export default interface ISeatingRepository{
    findSeatingByName(seatingName: string): Promise<ISeating | null>
    addSeating(seating: any): Promise<ISeating>
    getSeatings(): Promise<ISeating[]>
    updateSeating( seatingId: string, updatedData: Partial<ISeating>): Promise<ISeating | null>
    findSeatingById(seatingId: string): Promise<ISeating | null>
    deleteSeating(seatingId: string): Promise<void>
    isList(seatingId: string, updatedData: Partial<ISeating>): Promise<ISeating | null>
}