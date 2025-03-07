import { IMiscellaneous, IMiscellaneousCreate } from "../../../interfaces/entities/miscellaneous.entity";
import IMiscellaneousRepository from "../../../interfaces/repository/admin/miscellaneous.repository";
import IMiscellaneousServices from "../../../interfaces/services/admin/miscellaneous.services";
import { MiscellaneousRepository } from "../../../repositories/entities/adminRepositories.ts/miscellaneousRepository";

export class MiscellaneousServices implements IMiscellaneousServices {
  private _miscellaneousRepo: IMiscellaneousRepository;
  constructor( miscellaneousRepo: IMiscellaneousRepository ) {
    this._miscellaneousRepo = miscellaneousRepo;
  }

  async getMiscellaneous(): Promise<IMiscellaneous[]> {
    try {
      return await this._miscellaneousRepo.getMiscellaneous();
    } catch (error) {
      throw error;
    }
  }

  async addMiscellaneous(miscellaneousData: IMiscellaneousCreate): Promise<IMiscellaneous> {
    try {
      console.log(miscellaneousData, "miscellaneousData");
      const existingMiscellaneous = await this._miscellaneousRepo.findMiscellaneousByName(
        miscellaneousData.name
      );
      if (existingMiscellaneous) {
        const error = new Error("already existing miscellaneous");
        error.name = "AlreadyExists";
        throw error;
      }
      const miscellaneous = {
        name: miscellaneousData.name,
        description: miscellaneousData.description,
        estimatedCost: {
          max: miscellaneousData.endingPrice,
          min: miscellaneousData.startingPrice,
        },
        list: miscellaneousData.blocked,
      };
      console.log(miscellaneous, "miscellaneous");
      const newMiscellaneous = await this._miscellaneousRepo.addMiscellaneous(miscellaneous);
      return newMiscellaneous;
    } catch (error) {
      throw error;
    }
  }
  async updateMiscellaneous(miscellaneousId: string, updatedData: any): Promise<IMiscellaneous | null> {
    try {
      const updatedMiscellaneous = await this._miscellaneousRepo.updateMiscellaneous(
        miscellaneousId,
        updatedData
      );
      return updatedMiscellaneous;
    } catch (error) {
      throw error;
    }
  }
  async deleteMiscellaneous(miscellaneousId: string): Promise<void> {
    try {
      const miscellaneous = await this._miscellaneousRepo.findMiscellaneousById(miscellaneousId);
      if (!miscellaneous) {
        const error = new Error("Miscellaneous not found");
        error.name = "MiscellaneousNotFound";
        throw error;
      }

      await this._miscellaneousRepo.deleteMiscellaneous(miscellaneousId);
      return;
    } catch (error) {
      throw error;
    }
  }
  async isList( miscellaneousId: string, updatedData: Partial<IMiscellaneous> ): Promise<IMiscellaneous | null> {
    try {
      const miscellaneous = await this._miscellaneousRepo.findMiscellaneousById(miscellaneousId);
      if (!miscellaneous) {
        const error = new Error("Miscellaneous not found");
        error.name = "MiscellaneousNotFound";
        throw error;
      }

      return await this._miscellaneousRepo.isList(miscellaneousId, updatedData);
    } catch (error) {
      throw error;
    }
  }
}

const adminMiscellaneousRepository = new MiscellaneousRepository();
export const adminMiscellaneouServices = new MiscellaneousServices(adminMiscellaneousRepository);
