import { ISeating, ISeatingCreate } from "../../entities/seating.entity";

export default interface ISeatingServices{
    getSeatings(): Promise<ISeating[]>
    addSeating(seatingData: ISeatingCreate): Promise<ISeating>
    updateSeating(seatingId: string, updatedData: any): Promise<ISeating | null>
    deleteSeating(seatingId: string): Promise<void>
    isList( seatingId: string, updatedData: Partial<ISeating> ): Promise<ISeating | null>
}