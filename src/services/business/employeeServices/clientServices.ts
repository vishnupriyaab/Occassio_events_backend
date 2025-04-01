import { IClientData } from "../../../interfaces/entities/user.entity";
import IClientRepository from "../../../interfaces/repository/employee/client.repository";
import IClientService from "../../../interfaces/services/employee/client.services";
import { ClientRepository } from "../../../repositories/entities/employeeRepository/clientRepository";

export class ClientService implements IClientService {
  private _clientRepo: IClientRepository;
  constructor(clientRepo: IClientRepository) {
    this._clientRepo = clientRepo;
  }

  async fetchClients(employeeId: string): Promise<IClientData[] | null> {
    try {
      const employee = await this._clientRepo.findEmployeeById(employeeId);

      if (!employee) {
        throw new Error("Employee not found");
      }
      const assignedUserIds = employee.assignedUsers;
      const users = await this._clientRepo.findAssignedUsers(assignedUserIds);

      const clientsData = await Promise.all(
        users.map(async (user) => {
          let entryData = null;
          if (user.entryId) {
            entryData = await this._clientRepo.findEntryRegFormById(
              user.entryId
            );
          }

          if (!user._id) {
            throw new Error("User ID is undefined");
          }

          return {
            clientId: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            eventName: entryData?.eventName || "",
            startDate: entryData?.startDate || "",
            endDate: entryData?.endDate || "",
            guestCount: entryData?.guestCount || 0,
            entryId: user.entryId || "",
            ////   Location   ////
            district: entryData?.district || "",
            state: entryData?.state || "",
            pincode: entryData?.pincode || "",
            ////   features   ////
            venue: entryData?.venue || "",
            decoration: entryData?.decoration || false,
            sound: entryData?.sound || false,
            seating: entryData?.seating || false,
            photography: entryData?.photography || false,
            foodOptions: entryData?.foodOptions || {
              welcomeDrink: false,
              starters: false,
              mainCourse: false,
              dessert: false,
            },
          };
        })
      );
      return clientsData;
    } catch (error) {
      console.error("Error in fetchClients service:", error);
      throw error;
    }
  }
}
const emplClientRepo = new ClientRepository();
export const emplClientService = new ClientService(emplClientRepo);
