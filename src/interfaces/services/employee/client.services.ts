import { IClientData } from "../../entities/user.entity";

export default interface IClientService{
    fetchClients(employeeId: string): Promise<IClientData[] | null>
}