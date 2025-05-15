import { IBooking } from "../../entities/booking.entity";
import IEstimation from "../../entities/estimation.entity";
import IEntryRegFormData from "../../entities/IEntryFormReg.entity";
import { IClientData, IUser } from "../../entities/user.entity";

export default interface ISubClientRepository {
  findUserById(userId: string): Promise<IUser>;
  findEntryFormById(entryId: string): Promise<IEntryRegFormData>;
  getClientData(userId: string): Promise<IClientData | null>;
  fetchBookingData(estimatedId: string): Promise<IBooking>
  fetchEntryDetails(entryId:string):Promise<IEntryRegFormData>
  fetchEstimation(estimatedId: string): Promise<IEstimation>
}
