import { Document } from "mongoose";
import ISubClientRepository from "../../../interfaces/repository/user/subscription.client.repository";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import { IClientData, IUser } from "../../../interfaces/entities/user.entity";
import User from "../../../models/userModel";
import IEntryRegFormData from "../../../interfaces/entities/IEntryFormReg.entity";
import EntryRegForm from "../../../models/userEntryDetails";
import { IBooking } from "../../../interfaces/entities/booking.entity";
import Booking from "../../../models/bookingModel";
import IEstimation from "../../../interfaces/entities/estimation.entity";
import Estimation from "../../../models/estimationModel";

export class SubClientRepository
  extends CommonBaseRepository<{
    user: Document & IUser;
    entryRegForm: Document & IEntryRegFormData;
    booking: IBooking & Document;
    estimation: IEstimation & Document;
  }>
  implements ISubClientRepository
{
  constructor() {
    super({
      user: User,
      entryRegForm: EntryRegForm,
      booking: Booking,
      estimation: Estimation,
    });
  }

  async findUserById(userId: string): Promise<IUser> {
    try {
      const user = await this.findById("user", userId);
      return user!;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }

  async findEntryFormById(entryId: string): Promise<IEntryRegFormData> {
    try {
      const entryForm = await this.findById("entryRegForm", entryId);
      return entryForm!;
    } catch (error) {
      console.error("Error finding entry form by ID:", error);
      throw error;
    }
  }

  async getClientData(userId: string): Promise<IClientData | null> {
    try {
      const user = await this.findById("user", userId);

      if (!user || !user.entryId) {
        return null;
      }

      const entryForm = await this.findById("entryRegForm", user.entryId);

      if (!entryForm) {
        return null;
      }

      const clientData: IClientData = {
        clientId: userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        entryId: user.entryId,
        venue: entryForm.venue,
        decoration: entryForm.decoration,
        sound: entryForm.sound,
        seating: entryForm.seating,
        photography: entryForm.photography,
        foodOptions: {
          welcomeDrink: entryForm.foodOptions.welcomeDrink,
          starters: entryForm.foodOptions.starters,
          mainCourse: entryForm.foodOptions.mainCourse,
          dessert: entryForm.foodOptions.dessert,
        },
        eventName: entryForm.eventName,
        startDate: entryForm.startDate,
        endDate: entryForm.endDate,
        district: entryForm.district,
        state: entryForm.state,
        pincode: entryForm.pincode,
        guestCount: entryForm.guestCount,
      };

      return clientData;
    } catch (error) {
      console.error("Error getting client data:", error);
      throw error;
    }
  }


  async fetchBookingData(estimatedId: string): Promise<IBooking> {
    try {
      const result = await this.findOne("booking", {
        estimatedId: estimatedId,
      });
      return result!;
    } catch (error) {
      throw error;
    }
  }

  async fetchEstimation(estimatedId: string): Promise<IEstimation> {
    try {
      const estimationData = await this.findOne("estimation", {
        _id: estimatedId,
      });
      return estimationData!;
    } catch (error) {
      throw error;
    }
  }

  async fetchEntryDetails(entryId:string):Promise<IEntryRegFormData>{
    try {
      const entryDetails = await this.findOne("entryRegForm", {_id: entryId})
      return entryDetails!;
    } catch (error) {
      throw error
    }
  }
  
}
