import { Request, Response } from "express";
import IEntryRegController from "../../../interfaces/controller/user/entryReg.controller";
import IEntryRegService from "../../../interfaces/services/user/entryReg.services";
import IEntryRegFormData from "../../../interfaces/entities/IEntryFormReg.entity";
import { userEntryRegService } from "../../../services/business/userServices/entryRegServices";
import { successResponse } from "../../../integration/responseHandler";
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
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }

  async entryPayment(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      console.log(email);

      const paymentLink = await this._entryRegService.createPaymentLink(email);
  
      await this._entryRegService.sendPaymentEmail(email, paymentLink);
  
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Payment link sent successfully",
        { email, paymentLink }
      );

    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }
}

export const userEntryRegController = new EntryRegController(
  userEntryRegService
);
