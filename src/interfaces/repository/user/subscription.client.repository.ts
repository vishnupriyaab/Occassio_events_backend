import IEntryRegFormData from "../../entities/IEntryFormReg.entity";
import { IClientData, IUser } from "../../entities/user.entity";

export default interface ISubClientRepository {
  findUserById(userId: string): Promise<IUser | null>;
  findEntryFormById(entryId: string): Promise<IEntryRegFormData | null>;
  getClientData(userId: string): Promise<IClientData | null>;
}
