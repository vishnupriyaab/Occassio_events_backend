import { IBooking } from "../../entities/booking.entity";
import IEstimation from "../../entities/estimation.entity";
import IEntryRegFormData from "../../entities/IEntryFormReg.entity";
import { IClientData } from "../../entities/user.entity";

export default interface ISubClientService{
    fetchClientData(clientId:string):Promise<IClientData | undefined>
    fetchBooking(estimatedId: string):Promise<IBooking>
    fetchEstimatedData(estimatedId:string):Promise<IEstimation>
    fetchEntryDetails(userId: string):Promise<IEntryRegFormData>
}