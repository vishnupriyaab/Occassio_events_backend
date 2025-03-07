import { Request, Response } from "express";
import IVenueServices from "../../../interfaces/services/admin/venue.services";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { adminVenueServices } from "../../../services/business/adminServices/venueServices";

export class venueController {
  private _venueService: IVenueServices;
  constructor(venueService: IVenueServices) {
    this._venueService = venueService;
  }

  async getVenue(req: Request, res: Response): Promise<void> {
    try {
      const venues = await this._venueService.getVenue();
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

  async addVenue(req: Request, res: Response): Promise<void> {
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
      const newVenue = await this._venueService.addVenue({
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

  async updateVenue(req: Request, res: Response): Promise<void> {
    try {
      const venueId = req.params.id;
      const { name, description, startingPrice, endingPrice } = req.body;
    //   console.log(startingPrice,endingPrice,"222")
      const updatedData = { name, description, startingPrice, endingPrice };
      const updateVenu = await this._venueService.updateVenue(
        venueId,
        updatedData
      );
      console.log(updateVenu,"qqqq")
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

  async deleteVenue(req: Request, res: Response): Promise<void> {
    try {
      const VenueId = req.params.id;
      await this._venueService.deleteVenue(VenueId);

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
      const updatedVenue = await this._venueService.isList(venueId, {
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

export const adminVenueController = new venueController(adminVenueServices);
