import {
  IVenue,
  IVenueCreate,
} from "../../../interfaces/entities/venue.entity";
import IVenueRepository from "../../../interfaces/repository/admin/venue.repository";
import IVenueServices from "../../../interfaces/services/admin/venue.services";
import { venueRepository } from "../../../repositories/entities/adminRepositories.ts/venueRepository";

export class venueServices implements IVenueServices {
  private _venueRepo: IVenueRepository;
  constructor(venueRepo: IVenueRepository) {
    this._venueRepo = venueRepo;
  }

  async getVenue(): Promise<IVenue[]> {
    try {
      return await this._venueRepo.getVenues();
    } catch (error) {
      throw error;
    }
  }

  async addVenue(venueData: IVenueCreate): Promise<IVenue> {
    try {
      console.log(venueData, "venueData");
      const existingVenue = await this._venueRepo.findVenueByName(
        venueData.name
      );
      if (existingVenue) {
        const error = new Error("already existing venue");
        error.name = "AlreadyExists";
        throw error;
      }
      const venue = {
        name: venueData.name,
        description: venueData.description,
        estimatedCost: {
          max: venueData.endingPrice,
          min: venueData.startingPrice,
        },
        list: venueData.blocked,
      };
      console.log(venue, "venue");
      const newVenue = await this._venueRepo.addVenue(venue);
      return newVenue;
    } catch (error) {
      throw error;
    }
  }
  async updateVenue(venueId:string, updatedData: any):Promise<IVenue | null>{
    try {
        const updatedVenue = await this._venueRepo.updateVenue(venueId, updatedData)
        return updatedVenue
    } catch (error) {
        throw error
    }
  }
  async deleteVenue(venueId:string):Promise<void>{
    try {
        const venue = await this._venueRepo.findVenueById(venueId);
      if (!venue) {
        const error = new Error('Venue not found');
        error.name = 'VenueNotFound'
        throw error;
      }

      await this._venueRepo.deleteVenue(venueId);
      return;
    } catch (error) {
        throw error;
    }
  }
  async isList(venueId: string, updatedData: Partial<IVenue>): Promise<IVenue | null> {
    try {
      const venue = await this._venueRepo.findVenueById(venueId);
      if (!venue) {
        const error = new Error("Venue not found");
        error.name = "VenueNotFound";
        throw error;
      }
  
      return await this._venueRepo.isList(venueId, updatedData);
    } catch (error) {
      throw error;
    }
  }
  
}

const adminVenueRepository = new venueRepository();
export const adminVenueServices = new venueServices(adminVenueRepository);
