import { IBooking } from "../../entities/booking.entity";

export default interface IPaymentServices {
  alreadyDoneBooking(estimatedId: string): Promise<IBooking>;
  createBooking(estimatedId: string): Promise<any>;
  fetchEmail(
    estimatedId: string
  ): Promise<{ email: string; grandTotal: Number }>;
  createFirstPaymentLink(
    email: string,
    grandTotal: number,
    estimatedId: string
  ): Promise<string>;
  sendPaymentLinkToEmail(email: string, paymentLink: string): Promise<void>;
  updateFirstPaymentStatus(
    estimatedId: string,
    transactionId: string,
    paymentStatus: "pending" | "completed" | "failed" | "refund",
    paidAmount: string
  ): Promise<any>;
}
