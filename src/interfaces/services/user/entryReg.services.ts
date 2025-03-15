import IEntryRegFormData from "../../entities/IEntryFormReg.entity";

export default interface IEntryRegService{
    registerEntry(data: IEntryRegFormData):Promise<IEntryRegFormData | null>
}