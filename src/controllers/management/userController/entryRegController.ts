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
import stripe from "stripe";

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

  async handlePaymentWebhook(req: Request, res: Response): Promise<void> {
    try {
      const sig = req.headers["stripe-signature"] as string;

      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET as string
        );
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        res
          .status(400)
          .send(
            `Webhook Error: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
        return;
      }
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        if (session.metadata) {
          const email = session.metadata.email;
          const entryId = session.metadata.entryId;
          if (email && entryId) {
            await this._entryRegService.updatePaymentStatus(
              entryId,
              session.id,
              "completed"
            );
            console.log(
              `Payment completed for entry ${entryId}, email: ${email}`
            );
            const createUserDB = await this._entryRegService.createUserDb(entryId)
            // const user = this._entryRegService.createUser()
            //assign employee to a user
          } else {
            console.warn(
              "Missing required metadata in session",
              session.metadata
            );
          }
        } else {
          console.warn("No metadata found in the session");
        }
      }

      res.status(200).json({ received: true });
    } catch (error) {
      if(error instanceof Error){
        if(error.name === 'EntryUserIsNotFound'){
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, 'Entry User is not found')
          return;
        }
        if(error.name === 'UserCreationFailed'){
          ErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, 'Failed to create user')
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
