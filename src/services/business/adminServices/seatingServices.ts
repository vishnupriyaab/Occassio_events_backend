import { ISeating, ISeatingCreate } from "../../../interfaces/entities/seating.entity";
import ISeatingRepository from "../../../interfaces/repository/admin/seating.repository";
import ISeatingServices from "../../../interfaces/services/admin/seating.services";
import { seatingRepository } from "../../../repositories/entities/adminRepositories.ts/seatingRepository";

export class seatingServices implements ISeatingServices {
  private _seatingRepo: ISeatingRepository;
  constructor( seatingRepo: ISeatingRepository ) {
    this._seatingRepo = seatingRepo;
  }

  async getSeatings(): Promise<ISeating[]> {
    try {
      return await this._seatingRepo.getSeatings();
    } catch (error) {
      throw error;
    }
  }

  async addSeating(seatingData: ISeatingCreate): Promise<ISeating> {
    try {
      console.log(seatingData, "seatingData");
      const existingSeating = await this._seatingRepo.findSeatingByName(
        seatingData.name
      );
      if (existingSeating) {
        const error = new Error("already existing seating");
        error.name = "AlreadyExists";
        throw error;
      }
      const seating = {
        name: seatingData.name,
        description: seatingData.description,
        estimatedCost: {
          max: seatingData.endingPrice,
          min: seatingData.startingPrice,
        },
        list: seatingData.blocked,
      };
      console.log(seating, "seating");
      const newSeating = await this._seatingRepo.addSeating(seating);
      return newSeating;
    } catch (error) {
      throw error;
    }
  }
  async updateSeating(seatingId: string, updatedData: any): Promise<ISeating | null> {
    try {
      const updatedSeating = await this._seatingRepo.updateSeating(
        seatingId,
        updatedData
      );
      return updatedSeating;
    } catch (error) {
      throw error;
    }
  }
  async deleteSeating(seatingId: string): Promise<void> {
    try {
      const seating = await this._seatingRepo.findSeatingById(seatingId);
      if (!seating) {
        const error = new Error("Seating not found");
        error.name = "SeatingNotFound";
        throw error;
      }

      await this._seatingRepo.deleteSeating(seatingId);
      return;
    } catch (error) {
      throw error;
    }
  }
  async isList(
    seatingId: string,
    updatedData: Partial<ISeating>
  ): Promise<ISeating | null> {
    try {
      const seating = await this._seatingRepo.findSeatingById(seatingId);
      if (!seating) {
        const error = new Error("Seating not found");
        error.name = "SeatingNotFound";
        throw error;
      }

      return await this._seatingRepo.isList(seatingId, updatedData);
    } catch (error) {
      throw error;
    }
  }
}

const adminSeatingRepository = new seatingRepository();
export const adminSeatingServices = new seatingServices(adminSeatingRepository);
