import { Request, Response } from "express";
import IEntryRegController from "../../../interfaces/controller/user/entryReg.controller";
import IEntryRegService from "../../../interfaces/services/user/entryReg.services";
import IEntryRegFormData from "../../../interfaces/entities/IEntryFormReg.entity";
import { userEntryRegService } from "../../../services/business/userServices/entryRegServices";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";


export class EntryRegController implements IEntryRegController {
  private _entryRegService: IEntryRegService;
  constructor(entryRegService: IEntryRegService) {
    this._entryRegService = entryRegService;
  }
  async entryReg(
    req: Request<{}, {}, IEntryRegFormData>,
    res: Response
  ): Promise<void> {
    try {
      const savedEntry = await this._entryRegService.registerEntry(req.body);
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Entry form submitted",
        savedEntry
      );
    } catch (error: unknown) {
      console.log(error);
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Entry registration failed. Please try again."
      );
    }
  }

  async entryPayment(req: Request, res: Response): Promise<void> {
    try {
      const { email, entryId } = req.body;

      const paymentLink = await this._entryRegService.createPaymentLink(
        email,
        entryId
      );

      await this._entryRegService.sendPaymentEmail(email, paymentLink);

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Payment link sent successfully",
        { email, paymentLink }
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "FailedToCreatePayment") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Failed to create Stripe payment link"
          );
          return;
        }
      }
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Entry registration failed. Please try again."
      );
    }
  }

 
}

export const userEntryRegController = new EntryRegController(
  userEntryRegService
);
