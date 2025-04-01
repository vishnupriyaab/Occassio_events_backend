import mongoose from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  password?: string;
  email: string;
  entryId: string;
  phone: number;
  isVerified?: boolean;
  isBlocked?: boolean;
  assignedEmployee?: mongoose.Types.ObjectId;
  resetPasswordToken?: string;
}

export interface IUserReg{
    name:string;
    email:string;
    phone: number;
}