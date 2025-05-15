import mongoose from "mongoose";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { EmailService } from "../../../integration/emailServices";
import stripe from "../../../integration/stripe";
import { IBooking } from "../../../interfaces/entities/booking.entity";
import { IEmailService } from "../../../interfaces/integration/IEmail";
import IPaymentRepository from "../../../interfaces/repository/user/payment.repository";
import IPaymentServices from "../../../interfaces/services/user/payment.services";
import { AppError } from "../../../middleware/errorHandling";
import { PaymentRepository } from "../../../repositories/entities/userRepositories/paymentRepository";

export class PaymentServices implements IPaymentServices {
  private _paymentRepository: IPaymentRepository;
  private _emailService: IEmailService;
  constructor(
    paymentRepository: IPaymentRepository,
    emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    }
  ) {
    this._paymentRepository = paymentRepository;
    this._emailService = new EmailService(emailConfig);
  }

  async alreadyDoneBooking(estimatedId:string):Promise<IBooking>{
    try {
      const alreadyExisted = await this._paymentRepository.alreadyDoneBooking(estimatedId);
      return alreadyExisted!
    } catch (error) {
      throw error;
    }
  }

  async createBooking(estimatedId: string): Promise<any> {
    try {
      const fetchEstimatedData =
        await this._paymentRepository.fetchEstimatedData(estimatedId);
      console.log(fetchEstimatedData, "fetchEstimatedData");

      const user = await this._paymentRepository.fetchUserDetails(fetchEstimatedData.userId!)

      const entryDetails = await this._paymentRepository.fetchEntryDetails(user.entryId);

      const bookingData: IBooking = {
        estimatedId: new mongoose.Types.ObjectId(estimatedId),
        userId: new mongoose.Types.ObjectId(fetchEstimatedData.userId),
        userName:user.name,
        eventName:entryDetails.eventName,
        guestCount: entryDetails.guestCount,
        employeeId: new mongoose.Types.ObjectId(fetchEstimatedData.employeeId),
        additionalCharge: 0,
        bookingStatus: "Confirmed",
        paidAmount: 0,
        paymentMethod: "Stripe",
        firstPayment: {
          status: "pending",
          transactionId: "",
        },
      };
      const createBooking = await this._paymentRepository.createBooking(bookingData)
      return createBooking!
    } catch (error) {
      throw error;
    }
  }

  async fetchEmail(
    estimatedId: string
  ): Promise<{ email: string; grandTotal: Number }> {
    try {
      const fetchEstimatedData =
        await this._paymentRepository.fetchEstimatedData(estimatedId);

      const grandTotal = fetchEstimatedData.grandTotal;

      const userDetails = await this._paymentRepository.fetchUserDetails(
        fetchEstimatedData.userId!
      );
      const email = userDetails.email;
      return { email, grandTotal };
    } catch (error) {
      throw error;
    }
  }

  async createFirstPaymentLink(
    email: string,
    grandTotal: number,
    estimatedId: string,
  ): Promise<string> {
    try {
      console.log(grandTotal, "grandTotal");
      const oneThirdAmount = Math.round(grandTotal / 3);
      const stripeAmount = oneThirdAmount * 100;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Initial Booking Fee (1/3 of Total)",
              },
              unit_amount: stripeAmount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/first-payment-success?session_id={CHECKOUT_SESSION_ID}&estimatedId=${estimatedId}`,
        // cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
        metadata: {
          email,
          estimatedId,
          paymentType: "first",
          oneThirdAmount
        },
      });

      if (!session.url) {
        throw new AppError(
          "Failed to create Stripe payment link",
          HttpStatusCode.BAD_REQUEST,
          "FailedToCreatePayment"
        );
      }
      return session.url;
    } catch (error) {
      throw error;
    }
  }

  async sendPaymentLinkToEmail(
    email: string,
    paymentLink: string
  ): Promise<void> {
    try {
      await this._emailService.sendPaymentLinkEmail(email, `${paymentLink}`);
    } catch (error) {
      throw error;
    }
  }

  async updateFirstPaymentStatus(
    estimatedId: string,
    transactionId: string,
    paymentStatus: "pending" | "completed" | "failed" | "refund",
    paidAmount:string
  ): Promise<any> {
    try {
      console.log("Muneerr");
      const updatedStatus = await this._paymentRepository.updatePaymentStatus(
        estimatedId,
        transactionId,
        paymentStatus,
        paidAmount
      );
      return updatedStatus!;
    } catch (error) {
      throw error;
    }
  }
}

const emailConfig = {
  user: process.env.EMAIL_COMPANY,
  pass: process.env.EMAIL_PASS,
  frontendUrl: process.env.FRONTEND_URL,
};
const paymentRepository = new PaymentRepository();
export const paymentService = new PaymentServices(
  paymentRepository,
  emailConfig
);
