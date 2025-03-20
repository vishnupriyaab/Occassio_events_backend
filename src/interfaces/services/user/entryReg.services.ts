import IEntryRegFormData from "../../entities/IEntryFormReg.entity";

export default interface IEntryRegService {
  registerEntry(data: IEntryRegFormData): Promise<IEntryRegFormData | null>;
  createPaymentLink(email: string, entryId: string): Promise<string>;
  sendPaymentEmail(email: string, paymentLink: string): Promise<void>;
//   updatePaymentStatus(
//     entryId: string,
//     transactionId: string,
//     status: "pending" | "completed" | "failed" | "refund"
//   ): Promise<IEntryRegFormData | null>;
}
