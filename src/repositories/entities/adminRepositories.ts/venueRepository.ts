import { IVenue } from "../../../interfaces/entities/venue.entity";
import IVenueRepository from "../../../interfaces/repository/admin/venue.repository";
import Venue from "../../../models/venueModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class venueRepository
  extends CommonBaseRepository<{ venue: Document & IVenue }>
  implements IVenueRepository
{
  constructor() {
    super({ venue: Venue });
  }
  async findVenueByName(venueName: string): Promise<IVenue | null> {
    return this.findOne("venue", { venueName });
  }
  async addVenue(venue: any): Promise<IVenue> {
    return this.createData("venue", venue);
  }
  async getVenues(): Promise<IVenue[]> {
    return this.findAll("venue", {});
  }
  async updateVenue( venueId: string, updatedData: Partial<IVenue>): Promise<IVenue | null> {
    console.log(venueId, updatedData,"000")
    return this.updateById("venue", venueId, updatedData);
  }
  async findVenueById(venueId: string): Promise<IVenue | null> {
    return this.findById("venue", venueId);
  }
  async deleteVenue(venueId: string): Promise<void> {
    await this.deleteById("venue", venueId);
  }
  async isList(venueId: string, updatedData: Partial<IVenue>): Promise<IVenue | null> {
    return this.updateById("venue", venueId, updatedData);
  }
}
