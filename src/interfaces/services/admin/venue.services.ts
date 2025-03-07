import { IVenue, IVenueCreate } from "../../entities/venue.entity";

export default interface IVenueServices{
    addVenue(venueData: IVenueCreate):Promise<IVenue>
    getVenue(): Promise<IVenue[]>
    updateVenue(venueId:string, updatedData: any):Promise<IVenue | null>
    deleteVenue(venueId:string):Promise<void>
    isList(venueId: string, updatedData: Partial<IVenue>): Promise<IVenue | null>
}