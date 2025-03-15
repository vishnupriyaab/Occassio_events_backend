import IEntryRegFormData from "../../../interfaces/entities/IEntryFormReg.entity";
import IEntryRegRepository from "../../../interfaces/repository/user/entryReg.repository";
import IEntryRegService from "../../../interfaces/services/user/entryReg.services";
import { EntryRegRepository } from "../../../repositories/entities/userRepositories.ts/entryRegRepository";

export class EntryRegService implements IEntryRegService{
    private _entryRegRepo: IEntryRegRepository;

    constructor( entryRegRepo: IEntryRegRepository ){
        this._entryRegRepo = entryRegRepo;
    }
    async registerEntry(data: IEntryRegFormData):Promise<IEntryRegFormData | null>{
        try {
            return await this._entryRegRepo.createEntryReg(data);
        } catch (error) {
            throw error;
        }
    }
}

const userEntryRegRepository = new EntryRegRepository()
export const userEntryRegService = new EntryRegService(userEntryRegRepository)