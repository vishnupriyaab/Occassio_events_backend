import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { IBooking } from "../../../interfaces/entities/booking.entity";
import IEstimation from "../../../interfaces/entities/estimation.entity";
import IEntryRegFormData from "../../../interfaces/entities/IEntryFormReg.entity";
import { IClientData } from "../../../interfaces/entities/user.entity";
import ISubClientRepository from "../../../interfaces/repository/user/subscription.client.repository";
import ISubClientService from "../../../interfaces/services/user/subscription.client.services";
import { AppError } from "../../../middleware/errorHandling";
import { SubClientRepository } from "../../../repositories/entities/userRepositories/subscriptionClientRepository";

export class SubClientService implements ISubClientService {
  private _subClientRepository: ISubClientRepository;
  constructor(subClientRepository: ISubClientRepository) {
    this._subClientRepository = subClientRepository;
  }
  async fetchClientData(clientId: string): Promise<IClientData | undefined> {
    try {
      const user = await this._subClientRepository.findUserById(clientId);
      if (!user) {
        throw new AppError(
          "User not found",
          HttpStatusCode.NOT_FOUND,
          "UserNotFound"
        );
      }
      const clientData = await this._subClientRepository.getClientData(
        clientId
      );
      if (!clientData) {
        throw new AppError(
          "Client data not found",
          HttpStatusCode.NOT_FOUND,
          "ClientDataNotFound"
        );
      }

      return clientData;
    } catch (error: unknown) {
      throw error;
    }
  }

  async fetchBooking(estimatedId: string):Promise<IBooking>{
    try {
      const bookingData = await this._subClientRepository.fetchBookingData(estimatedId);
      return bookingData!;
    } catch (error:unknown) {
      throw error;
    }
  }

  async fetchEstimatedData(estimatedId:string):Promise<IEstimation>{
    try {
      const estimationData = await this._subClientRepository.fetchEstimation(estimatedId);
      return estimationData!;
    } catch (error:unknown) {
      throw error;
    }
  }

  async fetchEntryDetails(userId: string):Promise<IEntryRegFormData>{
    try {
      const fetchEntryDetails = await this._subClientRepository.fetchEntryDetails(userId)
      return fetchEntryDetails!;
    } catch (error) {
      throw error;
    }
  }

}

const subClientRepository = new SubClientRepository();
export const subClientService = new SubClientService(subClientRepository);
