import mongoose from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  password?: string;
  email: string;
  entryId: string;
  phone: number;
  isBlocked?: boolean;
  isOnline?: boolean;
  isVerified?: boolean;
  assignedEmployee?: mongoose.Types.ObjectId;
  resetPasswordToken?: string;
}

export interface IUserReg{
    name:string;
    email:string;
    phone: number;
}

export interface IClientData {
  clientId: string;
  venue: string;
  decoration: boolean;
  sound: boolean;
  seating: boolean;
  photography: boolean;
  foodOptions: {
    welcomeDrink: boolean;
    starters: boolean;
    mainCourse: boolean;
    dessert: boolean;
  };
  name: string;
  email: string;
  phone: number;
  eventName: string;
  startDate: string;
  endDate: string;
  district: string;
  state: string;
  pincode: string;
  guestCount: number;
  entryId: string;
}