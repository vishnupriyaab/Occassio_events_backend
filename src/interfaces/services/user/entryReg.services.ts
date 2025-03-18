import IEntryRegFormData from "../../entities/IEntryFormReg.entity";

export default interface IEntryRegService{
    registerEntry(data: IEntryRegFormData):Promise<IEntryRegFormData | null>
    createPaymentLink(email: string): Promise<string>
    sendPaymentEmail(email: string, paymentLink: string): Promise<void>
}