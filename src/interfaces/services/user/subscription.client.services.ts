import { IClientData } from "../../entities/user.entity";

export default interface ISubClientService{
    fetchClientData(clientId:string):Promise<IClientData | undefined>
}