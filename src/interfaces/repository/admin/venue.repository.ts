import { IVenue } from "../../entities/venue.entity";

export default interface IVenueRepository{
    findVenueByName(venueName: string): Promise<IVenue | null>
    addVenue(venue: any): Promise<IVenue>
    getVenues(): Promise<IVenue[]>
    updateVenue( venueId: string, updatedData: Partial<IVenue>): Promise<IVenue | null>
}