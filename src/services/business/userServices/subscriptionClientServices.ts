import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { IClientData } from "../../../interfaces/entities/user.entity";
import ISubClientRepository from "../../../interfaces/repository/user/subscription.client.repository";
import ISubClientService from "../../../interfaces/services/user/subscription.client.services";
import { AppError } from "../../../middleware/errorHandling";
import { SubClientRepository } from "../../../repositories/entities/userRepositories.ts/subscriptionClientRepository";

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
}

const subClientRepository = new SubClientRepository();
export const subClientService = new SubClientService(subClientRepository);
