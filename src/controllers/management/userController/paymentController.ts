import { Request, Response } from "express";
import IPaymentController from "../../../interfaces/controller/user/payment.controller";
import IPaymentServices from "../../../interfaces/services/user/payment.services";
import { paymentService } from "../../../services/business/userServices/paymentServices";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import stripe from "stripe";
import IEntryRegService from "../../../interfaces/services/user/entryReg.services";
import { userEntryRegService } from "../../../services/business/userServices/entryRegServices";
import { AppError } from "../../../middleware/errorHandling";

export class PaymentController implements IPaymentController {
  private _paymentService: IPaymentServices;
  private _entryRegService: IEntryRegService;
  constructor(
    paymentService: IPaymentServices,
    entryRegService: IEntryRegService
  ) {
    this._paymentService = paymentService;
    this._entryRegService = entryRegService;
  }

  async oneByThirdPayment(req: Request, res: Response): Promise<void> {
    try {
      const { estimatedId } = req.body;

      const alreadyDoneBooking = await this._paymentService.alreadyDoneBooking(
        estimatedId
      );
      console.log(alreadyDoneBooking, "qwertyuioiugfdfghjklkjhgvbnm,");

      if (alreadyDoneBooking) {
        throw new AppError(
          "Already done your Booking",
          HttpStatusCode.BAD_REQUEST,
          "AlreadyExist"
        );
      } 

      await this._paymentService.createBooking(estimatedId);

      const emailAndGrantTotal = await this._paymentService.fetchEmail(
        estimatedId
      );

      console.log(
        emailAndGrantTotal.email,
        "sdfghjkhvhgdbhb",
        emailAndGrantTotal.grandTotal
      );
      const email = emailAndGrantTotal.email;
      const grandTotal = Number(emailAndGrantTotal.grandTotal);

      const paymentLink = await this._paymentService.createFirstPaymentLink(
        email,
        grandTotal,
        estimatedId
      );
      console.log(paymentLink, "paymentLink");

      await this._paymentService.sendPaymentLinkToEmail(email, paymentLink);

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Successfully completed the OneByThird Payment"
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AlreadyExist") {
          ErrorResponse(
            res,
            HttpStatusCode.CONFLICT,
            "Already done your Booking"
          );
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
          const estimatedId = session.metadata.estimatedId;
          const paymentType = session.metadata.paymentType;
          const paidAmount = session.metadata.oneThirdAmount;

          console.log(paymentType,"paymentType")

          //   if (!email || !entryId || !paymentType) {
          //   return ErrorResponse(res, HttpStatusCode.BAD_GATEWAY, "Invalid metadata in webhook")
          // }

          switch (paymentType) {
            case "entry":
              await this._entryRegService.updatePaymentStatus(
                entryId,
                session.id,
                "completed"
              );
              console.log(
                `Entry payment completed for ${entryId}, email: ${email}`
              );
              await this._entryRegService.createUserDb(entryId);
              break;

            case "first":
              await this._paymentService.updateFirstPaymentStatus(
                estimatedId,
                session.id,
                "completed",
                paidAmount
              );
              console.log(
                `First payment completed for ${entryId}, email: ${email}`
              );
              break;

            // case "complete":
            //   await this._entryRegService.updateCompletePaymentStatus(
            //     entryId,
            //     session.id,
            //     "completed"
            //   );
            //   console.log(`Complete payment received for ${entryId}, email: ${email}`);
            //   break;

            default:
              console.warn(`Unknown paymentType: ${paymentType}`);
          }
        } else {
          console.warn("No metadata found in the session");
        }
      }

      res.status(200).json({ received: true });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "EntryUserIsNotFound") {
          ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "Entry User is not found"
          );
          return;
        }
        if (error.name === "UserCreationFailed") {
          ErrorResponse(
            res,
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            "Failed to create user"
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

export const paymentController = new PaymentController(
  paymentService,
  userEntryRegService
);
