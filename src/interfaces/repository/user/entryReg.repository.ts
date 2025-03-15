import IEntryRegFormData from "../../entities/IEntryFormReg.entity";

export default interface IEntryRegRepository{
    createEntryReg(data: IEntryRegFormData):Promise<IEntryRegFormData | null>
}   