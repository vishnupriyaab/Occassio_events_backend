import { IBooking } from "../../entities/booking.entity";
import IEstimation from "../../entities/estimation.entity";
import IEntryRegFormData from "../../entities/IEntryFormReg.entity";
import { IUser } from "../../entities/user.entity";

export default interface IPaymentRepository {
  alreadyDoneBooking(estimatedId:string):Promise<IBooking>
  createBooking(bookingData: IBooking):Promise<IBooking>
  fetchEntryDetails(entryId:string):Promise<IEntryRegFormData>
  fetchEstimatedData(estimatedId: String): Promise<IEstimation>;
  fetchUserDetails(userId:string):Promise<IUser>
  updatePaymentStatus(estimatedId:string, transactionId:string, status: "pending" | "completed" | "failed" | "refund", paidAmount:string):Promise<any>
}
