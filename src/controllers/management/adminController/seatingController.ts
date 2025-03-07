import { Request, Response } from "express";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { ErrorResponse, successResponse } from "../../../integration/responseHandler";
import { adminSeatingServices } from "../../../services/business/adminServices/seatingServices";
import ISeatingServices from "../../../interfaces/services/admin/seating.services";

export class seatingController {
    private _seatingService: ISeatingServices;
    constructor( seatingService: ISeatingServices ) {
      this._seatingService = seatingService;
    }
  
    async getSeating(req: Request, res: Response): Promise<void> {
      try {
        const venues = await this._seatingService.getSeatings();
        return successResponse(
          res,
          HttpStatusCode.OK,
          "Venues fetched successfully",
          venues
        );
      } catch (error: unknown) {
        ErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        );
        return;
      }
    }
  
    async addSeating(req: Request, res: Response): Promise<void> {
      try {
        const { name, description, startingPrice, endingPrice, blocked } =
          req.body;
        console.log(
          name,
          description,
          startingPrice,
          endingPrice,
          blocked,
          "1234567890"
        );
        const newVenue = await this._seatingService.addSeating({
          name,
          description,
          startingPrice,
          endingPrice,
          blocked,
        });
        return successResponse(
          res,
          HttpStatusCode.CREATED,
          "New Venue is Added",
          newVenue
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.name === "AlreadyExists") {
            ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Venue already exists");
            return;
          }
        }
        ErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        );
        return;
      }
    }
  
    async updateSeating(req: Request, res: Response): Promise<void> {
      try {
        const venueId = req.params.id;
        const { name, description, startingPrice, endingPrice } = req.body;
        const updatedData = { name, description, startingPrice, endingPrice };
        const updateVenu = await this._seatingService.updateSeating(
          venueId,
          updatedData
        );
        return successResponse(
          res,
          HttpStatusCode.OK,
          "Venue successfully updated",
          updateVenu
        );
      } catch (error: unknown) {
        ErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        );
        return;
      }
    }
  
    async deleteSeating(req: Request, res: Response): Promise<void> {
      try {
        const VenueId = req.params.id;
        await this._seatingService.deleteSeating(VenueId);
  
        return successResponse(
          res,
          HttpStatusCode.OK,
          "Venue successfully deleted"
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.name === "VenueNotFound") {
            ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Venue not found");
            return;
          }
        }
        ErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        );
        return;
      }
    }
  
    async isList(req: Request, res: Response): Promise<void> {
      try {
        const venueId = req.params.id;
        const { blocked } = req.body;
        console.log(venueId, blocked, "Received on backend");
        const updatedVenue = await this._seatingService.isList(venueId, {
          list: blocked,
        });
  
        if (!updatedVenue) {
          const error = new Error("Venue not found");
          error.name = "VenueNotFound";
          throw error;
        }
        return successResponse(
          res,
          HttpStatusCode.OK,
          "Venue listing status updated successfully",
          updatedVenue
        );
      } catch (error: unknown) {
        ErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        );
        return;
      }
    }
  }
  
  export const adminSeatingController = new seatingController(adminSeatingServices);
  