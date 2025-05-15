import { Request, Response } from "express";
import ISubClientController from "../../../interfaces/controller/user/subscription.client.controller";
import ISubClientService from "../../../interfaces/services/user/subscription.client.services";
import { subClientService } from "../../../services/business/userServices/subscriptionClientServices";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import { AppError } from "../../../middleware/errorHandling";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { IBookingEstimation } from "../../../interfaces/entities/booking.entity";

export class SubClientController implements ISubClientController {
  private _subClientService: ISubClientService;
  constructor(subClientService: ISubClientService) {
    this._subClientService = subClientService;
  }
  async fetchSubClientData(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const clientId = req.id;
      console.log(clientId, "clientId");
      if (!clientId) {
        throw new AppError(
          "Client ID is required",
          HttpStatusCode.BAD_REQUEST,
          "ClientIDIsRequired"
        );
      }
      const clientData = await this._subClientService.fetchClientData(clientId);
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Clients fetched successfully",
        clientData
      );
    } catch (error: unknown) {
      console.log(error, "error");
      if (error instanceof Error) {
        if (error.name === "ClientIDIsRequired") {
          return ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Client ID is required"
          );
        }
        if (error.name === "UserNotFound") {
          return ErrorResponse(res, HttpStatusCode.NOT_FOUND, "User not found");
        }
        if (error.name === "ClientDataNotFound") {
          return ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "Client data not found"
          );
        }
      }
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Entry registration failed. Please try again."
      );
    }
  }

  async fetchBooking(req: Request, res: Response): Promise<void> {
    try {
      const estimatedId = req.params.estimatedId;
      console.log(estimatedId, "sdfghjk");

      const fetchBooking = await this._subClientService.fetchBooking(
        estimatedId
      );
      console.log(fetchBooking, "fetchBooking in controller");

      const fetchEstimatedData =
        await this._subClientService.fetchEstimatedData(estimatedId);

      const bookingDetails: IBookingEstimation = {
        bookingStatus: fetchBooking.bookingStatus,
        paidAmount: fetchBooking.paidAmount,
        paymentMethod: fetchBooking.paymentMethod,
        additionalCharge: fetchBooking.additionalCharge,
        venue: fetchEstimatedData.venue,
        seating: fetchEstimatedData.seating,
        food: fetchEstimatedData.food,
        soundSystem: fetchEstimatedData.soundSystem,
        PhotoAndVideo: fetchEstimatedData.PhotoAndVideo,
        Decoration: fetchEstimatedData.Decoration,
        grandTotal: fetchEstimatedData.grandTotal,
        eventName: fetchBooking.eventName,
        firstPayment: fetchBooking.firstPayment,
        guestNumber: fetchBooking.guestCount,
        name: fetchBooking.userName,
      };
      return successResponse(res, HttpStatusCode.OK, "Booking details fetched successfully", bookingDetails)
    } catch (error) {
      throw error;
    }
  }
}

export const subClientController = new SubClientController(subClientService);
