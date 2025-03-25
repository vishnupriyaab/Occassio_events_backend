import mongoose, { Schema, Document } from "mongoose";
import IEntryRegFormData from "../interfaces/entities/IEntryFormReg.entity";

const entryRegFormSchema: Schema = new Schema<IEntryRegFormData>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    decoration: {
      type: Boolean,
      default: false,
    },
    sound: {
      type: Boolean,
      default: false,
    },
    seating: {
      type: Boolean,
      default: false,
    },
    photography: {
      type: Boolean,
      default: false,
    },
    foodOptions: {
      welcomeDrink: {
        type: Boolean,
        default: false,
      },
      starters: {
        type: Boolean,
        default: false,
      },
      mainCourse: {
        type: Boolean,
        default: false,
      },
      dessert: {
        type: Boolean,
        default: false,
      },
    },
    entryPayment: {
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refund"],
        default: "pending",
      },
      transactionId: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const EntryRegForm = mongoose.model<Document & IEntryRegFormData>(
  "EntryRegForm",
  entryRegFormSchema
);

export default EntryRegForm;
