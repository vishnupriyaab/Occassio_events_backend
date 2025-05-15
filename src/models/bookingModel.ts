import mongoose, { Document, Schema } from "mongoose";
import { IBooking } from "../interfaces/entities/booking.entity";

const bookingSchema: Schema = new Schema<IBooking>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userName: {
    type: String,
  },
  eventName: {
    type: String,
  },
  guestCount: {
    type: Number,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    required: true,
  },
  firstPayment: {
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refund"],
      default: "pending",
    },
    transactionId: {
      type: String,
    },
  },
  estimatedId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  paidAmount: {
    type: Number,
  },
  paymentMethod: {
    type: String,
  },
  additionalCharge: {
    type: Number,
  },
});

const Booking = mongoose.model<IBooking & Document>("booking", bookingSchema);
export default Booking;
