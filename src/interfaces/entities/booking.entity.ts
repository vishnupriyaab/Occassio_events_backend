import { Types } from "mongoose";

export interface IBooking {
  userId: Types.ObjectId;
  userName:string;
  eventName:string;
  guestCount:number;
  employeeId: Types.ObjectId;
  bookingStatus: string;
  firstPayment: {
    status: "pending" | "completed" | "failed";
    transactionId: string;
  };
  estimatedId: Types.ObjectId;
  additionalCharge: number;
  paymentMethod: string;
  paidAmount: number;
}

export interface IBookingEstimation {
  bookingStatus: string;
  firstPayment: {
    status: "pending" | "completed" | "failed";
    transactionId: string;
  };
  additionalCharge: number;
  paymentMethod: string;
  paidAmount: number;
  venue: {
    details: string;
    noOf: number;
    cost: number;
  };
  seating: {
    details: string;
    noOf: number;
    cost: number;
  };
  food: {
    welcomeDrink: {
      details: string;
      noOf: number;
      cost: number;
    };
    mainCourse: {
      details: string;
      noOf: number;
      cost: number;
    };
    dessert: {
      details: string;
      noOf: number;
      cost: number;
    };
  };
  soundSystem: {
    details: string;
    noOf: number;
    cost: number;
  };
  PhotoAndVideo: {
    details: string;
    noOf: number;
    cost: number;
  };
  Decoration: {
    details: string;
    noOf: number;
    cost: number;
  };
  grandTotal: Number;
  createdAt?: Date;
  updatedAt?: Date;
  name:string;
  eventName:string;
  guestNumber:number;
}