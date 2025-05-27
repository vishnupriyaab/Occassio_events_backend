import mongoose, { Document } from "mongoose";
import IPaymentRepository from "../../../interfaces/repository/user/payment.repository";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import { IBooking } from "../../../interfaces/entities/booking.entity";
import Booking from "../../../models/bookingModel";
import IEstimation from "../../../interfaces/entities/estimation.entity";
import Estimation from "../../../models/estimationModel";
import { IUser } from "../../../interfaces/entities/user.entity";
import User from "../../../models/userModel";
import IEntryRegFormData from "../../../interfaces/entities/IEntryFormReg.entity";
import EntryRegForm from "../../../models/userEntryDetails";

export class PaymentRepository
  extends CommonBaseRepository<{
    booking: IBooking & Document;
    estimation: IEstimation & Document;
    user: IUser & Document;
    entryData: IEntryRegFormData & Document;
  }>
  implements IPaymentRepository
{
  constructor() {
    super({
      booking: Booking,
      estimation: Estimation,
      user: User,
      entryData: EntryRegForm,
    });
  }

  async alreadyDoneBooking(estimatedId: string): Promise<any> {
    try {
      console.log(estimatedId);
      const result = await this.findOne("booking", {
        estimatedId: estimatedId,
      });
      console.log(result, "result000000000000000");
      return result!;
    } catch (error) {
      throw error;
    }
  }

  async createBooking(bookingData: IBooking): Promise<IBooking> {
    try {
      const result = await this.createData("booking", bookingData);
      return result!;
    } catch (error) {
      throw error;
    }
  }

  async fetchUserDetails(userId: string): Promise<IUser> {
    try {
      console.log(userId);
      const userDetails = await this.findOne("user", { _id: userId });
      return userDetails!;
    } catch (error) {
      throw error;
    }
  }

  async fetchEstimatedData(estimatedId: String): Promise<IEstimation> {
    try {
      const result = await this.findOne("estimation", { _id: estimatedId });
      return result!;
    } catch (error) {
      throw error;
    }
  }

  async fetchEntryDetails(entryId: string): Promise<IEntryRegFormData> {
    try {
      const entryDetails = await this.findOne("entryData", { _id: entryId });
      return entryDetails!;
    } catch (error) {
      throw error;
    }
  }

  // async updateBookingStatus(estimatedId:string):Promise<any>{
  //   try {
  //     const updatedBookingStatus = await this.updateById("booking", estimatedId, {
  //       "bookingStatus": "Confirmed"
  //     })
  //     console.log(updatedBookingStatus,"updatedBookingStatus")
  //     return updatedBookingStatus!
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async updatePaymentStatus(
    estimatedId: string,
    transactionId: string,
    status: "pending" | "completed" | "failed" | "refund",
    paidAmount: string
  ): Promise<any> {
    try {
      console.log(estimatedId, transactionId, status, paidAmount, "Payment update params");

      const filter = { estimatedId: new mongoose.Types.ObjectId(estimatedId) };

      const updateData = {
        "firstPayment.status": status,
        "firstPayment.transactionId": transactionId,
      };

      const updatedBooking = await this.findOneAndUpdate(
        "booking",
        filter,
        updateData
      );

      console.log(updatedBooking, "Updated booking result");
      await this.updateOne(
        "booking",
        { estimatedId: estimatedId },
        { paidAmount: paidAmount },
        { upsert: true }
      );
      return updatedBooking;
    } catch (error:unknown) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  }
}
