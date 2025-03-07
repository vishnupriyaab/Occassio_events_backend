import { IMiscellaneous, IMiscellaneousCreate } from "../../entities/miscellaneous.entity"

export default interface IMiscellaneousServices{
    getMiscellaneous(): Promise<IMiscellaneous[]>
    addMiscellaneous(miscellaneousData: IMiscellaneousCreate): Promise<IMiscellaneous>
    updateMiscellaneous(miscellaneousId: string, updatedData: any): Promise<IMiscellaneous | null>
    deleteMiscellaneous(miscellaneousId: string): Promise<void>
    isList( miscellaneousId: string, updatedData: Partial<IMiscellaneous> ): Promise<IMiscellaneous | null>
}