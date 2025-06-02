import { Document } from "mongoose";
import { IBooking } from "../../../interfaces/entities/booking.entity";
import { IUser } from "../../../interfaces/entities/user.entity";
import IDashboardRepository from "../../../interfaces/repository/admin/dashboard.repository";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import User from "../../../models/userModel";
import Booking from "../../../models/bookingModel";
import { MonthlyRevenue } from "../../../interfaces/services/admin/dashboard.services";

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

      const result =
        revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
        console.log(result,"resulttt")
      return result;
    } catch (error: unknown) {
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

  async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    try {
      const currentYear = new Date().getFullYear();

      const pipeline = [
        {
          $match: {
            "firstPayment.status": "completed",
            createdAt: {
              $gte: new Date(currentYear, 0, 1),
              $lte: new Date(),
            },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            revenue: {
              $sum: {
                $add: [
                  { $ifNull: ["$paidAmount", 0] },
                  { $ifNull: ["$additionalCharge", 0] },
                ],
              },
            },
          },
        },
        {
          $sort: { "_id.month": 1 },
        },
        {
          $project: {
            month: {
              $switch: {
                branches: [
                  { case: { $eq: ["$_id.month", 1] }, then: "January" },
                  { case: { $eq: ["$_id.month", 2] }, then: "February" },
                  { case: { $eq: ["$_id.month", 3] }, then: "March" },
                  { case: { $eq: ["$_id.month", 4] }, then: "April" },
                  { case: { $eq: ["$_id.month", 5] }, then: "May" },
                  { case: { $eq: ["$_id.month", 6] }, then: "June" },
                  { case: { $eq: ["$_id.month", 7] }, then: "July" },
                  { case: { $eq: ["$_id.month", 8] }, then: "August" },
                  { case: { $eq: ["$_id.month", 9] }, then: "September" },
                  { case: { $eq: ["$_id.month", 10] }, then: "October" },
                  { case: { $eq: ["$_id.month", 11] }, then: "November" },
                  { case: { $eq: ["$_id.month", 12] }, then: "December" },
                ],
                default: "Unknown",
              },
            },
            revenue: "$revenue",
            _id: 0,
          },
        },
      ];

      console.log(pipeline,"pipeline");
      const result = await this.aggregate("Booking", pipeline);
      console.log(result ,"0000")
      return result;
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
      throw new Error("Failed to fetch monthly revenue data");
    }
  }
}
