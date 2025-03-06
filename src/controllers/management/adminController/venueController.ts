import { Request, Response } from "express";
import IVenueServices from "../../../interfaces/services/admin/venue.services";
import { successResponse } from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { adminVenueServices } from "../../../services/business/adminServices/venueServices";

export class venueController{
    private _venueService: IVenueServices
    constructor(venueService: IVenueServices){
        this._venueService = venueService
    }
    async getVenue(req:Request,res:Response):Promise<void>{
        try {
            const venues = await this._venueService.getVenue();
            return successResponse(
                res,
                HttpStatusCode.OK,
                "Venues fetched successfully",
                venues
            );
        } catch (error:unknown) {
            
        }
    }
    async addVenue(req:Request, res:Response):Promise<void>{
        try {
            const { name, description, startingPrice, endingPrice, blocked } = req.body
            console.log(name, description, startingPrice, endingPrice, blocked,"1234567890")
            const newVenue = await this._venueService.addVenue({name, description, startingPrice, endingPrice, blocked});
            return successResponse(
                res,
                HttpStatusCode.CREATED,
                "New Venue is Added",
                newVenue
              );
        } catch (error:unknown) {
            
        }
    }
}

export const adminVenueController = new venueController(adminVenueServices);
