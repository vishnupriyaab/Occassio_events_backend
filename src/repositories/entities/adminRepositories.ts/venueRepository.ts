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
    return this.updateById("venue", venueId, updatedData);
  }
}
