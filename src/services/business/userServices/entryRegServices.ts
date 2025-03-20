import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { EmailService } from "../../../integration/emailServices";
import stripe from "../../../integration/stripe";
import IEntryRegFormData from "../../../interfaces/entities/IEntryFormReg.entity";
import { IEmailService } from "../../../interfaces/integration/IEmail";
import IEntryRegRepository from "../../../interfaces/repository/user/entryReg.repository";
import IEntryRegService from "../../../interfaces/services/user/entryReg.services";
import { AppError } from "../../../middleware/errorHandling";
import { EntryRegRepository } from "../../../repositories/entities/userRepositories.ts/entryRegRepository";

export class EntryRegService implements IEntryRegService {
  private _entryRegRepo: IEntryRegRepository;
  private _emailService: IEmailService;

  constructor(
    entryRegRepo: IEntryRegRepository,
    emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    }
  ) {
    this._entryRegRepo = entryRegRepo;
    this._emailService = new EmailService(emailConfig);
  }
  async registerEntry(
    data: IEntryRegFormData
  ): Promise<IEntryRegFormData | null> {
    try {
      return await this._entryRegRepo.createEntryReg(data);
    } catch (error) {
      throw error;
    }
  }

  async createPaymentLink(email: string, entryId: string): Promise<string> {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Entry Registration Fee",
              },
              unit_amount: 10000, // ₹100.00
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
        metadata: {
          email,
          entryId,
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
      console.error("Error creating payment link:", error);
      throw new Error("Failed to generate payment link");
    }
  }

  async sendPaymentEmail(email: string, paymentLink: string): Promise<void> {
    try {
      await this._emailService.sendPaymentLinkEmail(email, `${paymentLink}`);
    } catch (error) {
      console.error("Error sending payment email:", error);
      throw new Error("Failed to send payment email");
    }
  }

  // async updatePaymentStatus(
  //   entryId: string,
  //   transactionId: string,
  //   status: "pending" | "completed" | "failed" | "refund"
  // ): Promise<IEntryRegFormData | null> {
  //   try {
  //     const updatedEntry = await this._entryRegRepo.updatePaymentStatus(
  //       entryId,
  //       transactionId,
  //       status
  //     );
  //     return updatedEntry;
  //   } catch (error) {
  //     console.error("Error updating payment status:", error);
  //     throw new Error("Failed to update payment status");
  //   }
  // }
}

const emailConfig = {
  user: process.env.EMAIL_COMPANY,
  pass: process.env.EMAIL_PASS,
  frontendUrl: process.env.FRONTEND_URL,
};

const userEntryRegRepository = new EntryRegRepository();
export const userEntryRegService = new EntryRegService(
  userEntryRegRepository,
  emailConfig
);
