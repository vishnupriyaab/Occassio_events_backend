import { IPhoto } from "../../entities/photo.entity"

export default interface IMiscellaneousRepository{
    findMiscellaneousByName(miscellaneousName: string): Promise<IPhoto | null>
    addMiscellaneous(miscellaneous: any): Promise<IPhoto>
    getMiscellaneous(): Promise<IPhoto[]>
    updateMiscellaneous( miscellaneousId: string, updatedData: Partial<IPhoto>): Promise<IPhoto | null>
    findMiscellaneousById(miscellaneousId: string): Promise<IPhoto | null>
    deleteMiscellaneous(miscellaneousId: string): Promise<void>
    isList( miscellaneousId: string, updatedData: Partial<IPhoto> ): Promise<IPhoto | null>
}