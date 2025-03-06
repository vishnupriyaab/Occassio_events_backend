import { IVenue, IVenueCreate } from "../../entities/venue.entity";

export default interface IVenueServices{
    addVenue(venueData: IVenueCreate):Promise<IVenue>
    getVenue(): Promise<IVenue[]>

}