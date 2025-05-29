import { Document } from "mongoose";
import { IBooking } from "../../../interfaces/entities/booking.entity";
import { IUser } from "../../../interfaces/entities/user.entity";
import IDashboardRepository from "../../../interfaces/repository/admin/dashboard.repository";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import User from "../../../models/userModel";
import Booking from "../../../models/bookingModel";

export class DashboardRepository
  extends CommonBaseRepository<{
    User: IUser & Document;
    Booking: IBooking & Document;
  }>
  implements IDashboardRepository
{
  constructor() {
    super({
      User: User,
      Booking: Booking,
    });
  }
  async getTotalUsers(): Promise<number> {
    return await this.count("User", { isBlocked: false });
  }

  async getTotalBookings(): Promise<number> {
    return await this.count("Booking", {});
  }

  async getTotalRevenue(): Promise<number> {
    try {
      // Use MongoDB aggregation for revenue calculation
      const model = this._models.Booking;
      const revenueResult = await model.aggregate([
        {
          $match: {
            "firstPayment.status": "completed",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $add: [
                  { $ifNull: ["$paidAmount", 0] },
                  { $ifNull: ["$additionalCharge", 0] },
                ],
              },
            },
          },
        },
      ]);

      return revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    } catch (error) {
      console.error("Error calculating total revenue:", error);
      return 0;
    }
  }

  async getTotalEvents(): Promise<number> {
    try {
      const model = this._models.Booking;
      const distinctEvents = await model.distinct("eventName", {
        eventName: { $nin: [null, "", undefined] },
      });

      return distinctEvents.length;
    } catch (error) {
      console.error("Error calculating total events:", error);
      return 0;
    }
  }
}
