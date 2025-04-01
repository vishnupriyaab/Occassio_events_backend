import IClientRepository from "../../../interfaces/repository/employee/client.repository";
import IClientService from "../../../interfaces/services/employee/client.services";
import { ClientRepository } from "../../../repositories/entities/employeeRepository/clientRepository";

export class ClientService implements IClientService {
  private _clientRepo: IClientRepository;
  constructor(clientRepo: IClientRepository) {
    this._clientRepo = clientRepo;
  }

  async fetchClients(employeeId: string): Promise<any[]> {
    try {
      // Get employee with assigned users
      const employee = await this._clientRepo.findEmployeeById(employeeId);

      if (!employee) {
        throw new Error("Employee not found");
      }

      // Get assigned user IDs
      const assignedUserIds = employee.assignedUsers;

      // Fetch user data with assigned users
      const users = await this._clientRepo.findAssignedUsers(assignedUserIds);

      // Build client data array
      const clientsData = await Promise.all(
        users.map(async (user) => {
          // Fetch entry data if entryId exists
          let entryData = null;
          if (user.entryId) {
            entryData = await this._clientRepo.findEntryRegFormById(
              user.entryId
            );
          }

          return {
            clientId: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            eventName: entryData?.eventName || null,
            startDate: entryData?.startDate || null,
            endDate: entryData?.endDate || null,
            guestCount: entryData?.guestCount || null,
            entryId: user.entryId || null,
            ////   Location   ////
            district: entryData?.district || null,
            state: entryData?.state || null,
            pincode: entryData?.pincode || null,
            ////   features   ////
            venue: entryData?.venue || null,
            decoration: entryData?.decoration || null,
            sound: entryData?.sound || null,
            seating: entryData?.seating || null,
            photography: entryData?.photography || null,
            foodOptions: entryData?.foodOptions || null,
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
