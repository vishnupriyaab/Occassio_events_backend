import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { EmailService } from "../../../integration/emailServices";
import { JWTService } from "../../../integration/jwtServices";
import stripe from "../../../integration/stripe";
import IEntryRegFormData from "../../../interfaces/entities/IEntryFormReg.entity";
import { IUser, IUserReg } from "../../../interfaces/entities/user.entity";
import { IEmailService } from "../../../interfaces/integration/IEmail";
import { IJWTService } from "../../../interfaces/integration/IJwt";
import IEmployeeRepository from "../../../interfaces/repository/admin/employee.repository";
import IUserRepository from "../../../interfaces/repository/user/auth.repository";
import IEntryRegRepository from "../../../interfaces/repository/user/entryReg.repository";
import IEntryRegService from "../../../interfaces/services/user/entryReg.services";
import { AppError } from "../../../middleware/errorHandling";
import { EmployeeRepository } from "../../../repositories/entities/adminRepositories.ts/employeeRepository";
import { UserRepository } from "../../../repositories/entities/userRepositories.ts/authRepository";
import { EntryRegRepository } from "../../../repositories/entities/userRepositories.ts/entryRegRepository";

export class EntryRegService implements IEntryRegService {
  private _entryRegRepo: IEntryRegRepository;
  private _emailService: IEmailService;
  private _userRepo: IUserRepository;
  private _employeeRepo: IEmployeeRepository;
  private _jwtService: IJWTService;

  constructor(
    entryRegRepo: IEntryRegRepository,
    emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    },
    userRepo: IUserRepository,
    employeeRepo: IEmployeeRepository,
    jwtService: IJWTService
  ) {
    this._entryRegRepo = entryRegRepo;
    this._emailService = new EmailService(emailConfig);
    this._userRepo = userRepo;
    this._employeeRepo = employeeRepo;
    this._jwtService = jwtService;
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
        success_url: `${process.env.FRONTEND_URL}/entry-payment-success?session_id={CHECKOUT_SESSION_ID}`,
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

  async updatePaymentStatus(
    entryId: string,
    transactionId: string,
    status: "pending" | "completed" | "failed" | "refund"
  ): Promise<IEntryRegFormData | null> {
    try {
      const updatedEntry = await this._entryRegRepo.updatePaymentStatus(
        entryId,
        transactionId,
        status
      );
      return updatedEntry;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw new Error("Failed to update payment status");
    }
  }
  async createUserDb(
    entryId: string
  ): Promise<IEntryRegFormData | null | undefined> {
    try {
      const entryUser = await this._entryRegRepo.findUserById(entryId);
      console.log(entryUser, "12121212123232");
      if (!entryUser) {
        throw new AppError(
          "Entry User is not found",
          HttpStatusCode.NOT_FOUND,
          "EntryUserIsNotFound"
        );
      }
      console.log(entryId,"entryId");
      const user: IUser = {
        name: entryUser.name,
        email: entryUser.email,
        phone: entryUser.phone,
        entryId: entryId,
      };
      const createdUser = await this._userRepo.createUser(user);
      console.log(createdUser, "userr");

      if (!createdUser) {
        throw new AppError(
          "Failed to create user",
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "UserCreationFailed"
        );
      }

      await this.assignEmployeeToUser(createdUser);

      return entryUser;
    } catch (error) {}
  }

  async assignEmployeeToUser(user: IUser): Promise<void> {
    try {
      const employeeWithLeastAssignments =
      await this._employeeRepo.findEmployeeWithLeastAssignments();

      if (!employeeWithLeastAssignments) {
        console.warn(`No unassigned employee found for user: ${user.email}`);
        return;
      }

      const userChange = await this._userRepo.updateUserAssignedEmployee(
        user._id!,
        employeeWithLeastAssignments._id
      );
      console.log(userChange,"userrrrrrrrChangeeeeeeeeee")

      const emplChange = await this._employeeRepo.markEmployeeAsAssigned(
        employeeWithLeastAssignments._id!,
        user._id!
      );
      console.log(emplChange, 'employeeeChangeeee')

      const token = this._jwtService.generateAccessToken({
        id: user._id || "",
        role: "user",
      });
      console.log(token, "token");
      // const decode = this._jwtService.verifyAccessToken(token);
      // console.log(decode, "decode");
      await this._userRepo.savePasswordResetToken(user._id, token);

      await this._emailService.sendEmployeeAssignedEmailToUser(
        employeeWithLeastAssignments.name,
        user.name,
        user.email,
        token
      );
    } catch (error) {
      console.error(`Error assigning employee to user: ${error}`);
      throw new AppError(
        "Failed to assign employee",
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "EmployeeAssignmentFailed"
      );
    }
  }
  // async assignEmployeeToUser(user: IUser): Promise<void> {
  //   try {
  //     // Find the employee with the least number of assigned users
  //     const employeeWithLeastAssignments =
  //       await this._employeeRepo.findEmployeeWithLeastAssignments();

  //     if (!employeeWithLeastAssignments) {
  //       console.warn(`No unassigned employee found for user: ${user.email}`);
  //       return;
  //     }

  //     await this._userRepo.updateUserAssignedEmployee(
  //       user._id!,
  //       employeeWithLeastAssignments._id
  //     );

  //     await this._employeeRepo.markEmployeeAsAssigned(
  //       employeeWithLeastAssignments._id!,
  //       user._id!
  //     );

  //     const token = this._jwtService.generateAccessToken({
  //       id: user._id || "",
  //       role: "user",
  //     });

  //     await this._userRepo.savePasswordResetToken(user._id, token);

  //     await this._emailService.sendEmployeeAssignedEmailToUser(
  //       employeeWithLeastAssignments.name,
  //       user.name,
  //       user.email,
  //       token
  //     );
  //   } catch (error) {
  //     console.error(`Error assigning employee to user: ${error}`);
  //     throw new AppError(
  //       "Failed to assign employee",
  //       HttpStatusCode.INTERNAL_SERVER_ERROR,
  //       "EmployeeAssignmentFailed"
  //     );
  //   }
  // }
}

const emailConfig = {
  user: process.env.EMAIL_COMPANY,
  pass: process.env.EMAIL_PASS,
  frontendUrl: process.env.FRONTEND_URL,
};

const userEntryRegRepository = new EntryRegRepository();
const userRepository = new UserRepository();
const employeeRepository = new EmployeeRepository();
const IjwtService: IJWTService = new JWTService();
export const userEntryRegService = new EntryRegService(
  userEntryRegRepository,
  emailConfig,
  userRepository,
  employeeRepository,
  IjwtService
);
