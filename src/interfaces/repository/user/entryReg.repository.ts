import IEntryRegFormData from "../../entities/IEntryFormReg.entity";

export default interface IEntryRegRepository{
    createEntryReg(data: IEntryRegFormData):Promise<IEntryRegFormData | null>
    updatePaymentStatus(
      entryId: string,
      transactionId: string,
      status: 'pending' | 'completed' | 'failed' | 'refund'
    ): Promise<IEntryRegFormData | null>
}   